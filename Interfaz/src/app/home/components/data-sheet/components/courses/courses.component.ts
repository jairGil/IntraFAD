import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Course } from 'src/app/home/models/course.model';
import { FileSend } from 'src/app/home/models/file-send.model';
import { ArchivosService } from 'src/app/home/services/archivos.service';
import { CoursesService } from 'src/app/home/services/courses.service';
import { NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss', '../../data-sheet.component.scss', '../../../../home.component.scss']
})
export class CoursesComponent {
  private idDocente: any;
  public URL_DOC = environment.URL_DOC;
  public modo_agregar = false;
  public cursos: any;
  public docCur: boolean = false;
  public curName: String | null = null;

  public loading: boolean = false;
  public msg: string = '';

  curForm = this.formBuilder.group({
    tipo: ['Didactico', Validators.required],
    nombre: ['', Validators.required],
    fecha_fin: ['', Validators.required],
    institucion: ['', Validators.required],
    duracion: ['', Validators.required],
    constancia: ['', Validators.required]
  });

  constructor(
    private authService: AuthService,
    private cursoService: CoursesService,
    private archivosService: ArchivosService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.idDocente = this.authService.decodeToken()._id;
  }

  ngOnInit(): void {
    this.getCursos();
    this.modo_agregar = false;
  }

  getCursos() {
    this.cursoService.getCursos(this.idDocente).subscribe({
      next: (res: any) => {
        this.cursos = res.cursos;
        this.notificationService.showNotification(res.msg, res.code);
      },
      error: (err: any) => {
        // console.log(err);
        this.notificationService.showNotification(err.error.msg, 500);
      }
    });
  }

  deleteCurso(id: string) {
    this.cursoService.deleteCurso(id).subscribe({
      next: (res: any) => {
        this.getCursos();
        this.notificationService.showNotification(res.msg, res.code);
      },
      error: (err: any) => {
        // console.log(err);
        this.notificationService.showNotification(err.error.msg, 500);
      }
    });
  }

  cambiarModo(modo: number) {
    switch (modo) {
      case 1:
        this.modo_agregar = true;
        break;
      case 2:
        this.modo_agregar = false;
        break;
    }
  }

  public async enviarDatos() {
    // this.uploadDocument('cursos', 'constancia_F');

    let curso: Course = {
      nombre: this.curForm.get('nombre')?.value!,
      tipo: this.curForm.get('tipo')?.value!,
      fecha_fin: new Date(this.curForm.get('fecha_fin')?.value!),
      institucion: this.curForm.get('institucion')?.value!,
      duracion: Number(this.curForm.get('duracion')?.value!),
      id_docente: this.idDocente
    }

    try {
      const res = await firstValueFrom(this.cursoService.addCurso(curso));

      if (res.code === 200) {

        if (this.curName != null) {
          // Datos del archivo
          const fileData: FileSend = {
            type: 'cursos',
            name: this.curForm.get('institucion')?.value! + '_' + this.curForm.get('tipo')?.value! + '_' + this.curForm.get('nombre')?.value!,
            date: new Date(this.curForm.get('fecha_fin')?.value!).toISOString().slice(0, 10).replace(/-/g, "_"),
          }
          // Subir el archivo
          await this.updateAcademicDataDoc(fileData, 'constancia', res.idFT);
        }
      }
      this.getCursos();
      this.cambiarModo(2);
      this.notificationService.showNotification(res.msg, res.code);
      
    } catch (err) {
      let error = "Ha ocurrido un error al enviar los datos";
      this.notificationService.showNotification(error, 500);
    }

    this.curName = null;
  }

  onCursoSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.curForm.get('constancia')?.setValue(file);
      this.docCur = true;
      this.curName = file.name;
    }
  }

  private async updateAcademicDataDoc(fileData: FileSend, campo: string, idFT: string): Promise<void> {
    const fieldValue = this.curForm.get(campo)?.value;

    if (!fieldValue) {
      return;
    }

    const formData = new FormData();
    formData.append(fileData.type, fieldValue);

    this.loading = true;
    this.msg = 'Subiendo documentos...';

    const updateQuery = await this.archivosService.uploadDocument(fileData, fieldValue, idFT);

    if (!updateQuery) {
      return;
    }

    this.cursoService.updateCurso(updateQuery).subscribe({
      next: (res: any) => {
        console.log(res);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  public showDoc(dir: String): void {
    this.archivosService.getIDDoc(dir)
      .subscribe(
        data => {
          const file = new Blob([data], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        }
      )
  }

  get nombre() { return this.curForm.get('nombre'); }
  get tipo() { return this.curForm.get('tipo'); }
  get fecha_fin() { return this.curForm.get('fecha_fin'); }
  get institucion() { return this.curForm.get('institucion'); }
  get duracion() { return this.curForm.get('duracion'); }
  get constancia() { return this.curForm.get('constancia'); }
}
