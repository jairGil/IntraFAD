import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Course } from 'src/app/home/models/course.model';
import { ArchivosService } from 'src/app/home/services/archivos.service';
import { CoursesService } from 'src/app/home/services/courses.service';
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
  public curName!: String;

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
    private formBuilder: FormBuilder
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
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  deleteCurso(id: string) {
    this.cursoService.deleteCurso(id).subscribe({
      next: (res: any) => {
        this.getCursos();
      },
      error: (err: any) => {
        console.log(err);
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

  enviarDatos() {
    // this.uploadDocument('cursos', 'constancia_F');

    let curso: Course = {
      nombre: this.curForm.get('nombre')?.value!,
      tipo: this.curForm.get('tipo')?.value!,
      fecha_fin: new Date(this.curForm.get('fecha_fin')?.value!),
      institucion: this.curForm.get('institucion')?.value!,
      duracion: Number(this.curForm.get('duracion')?.value!),
      constancia: "no_inicializado.pdf",
      id_docente: this.idDocente
    }

    this.cursoService.addCurso(curso).subscribe({
      next: (res: any) => {
        if (res.value) {
          this.getCursos();
          this.cambiarModo(2);
        }
      },
      error: (err: any) => {
        console.log(err);
      }
    });

  }

  onCursoSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.curForm.get('constancia')?.setValue(file);
      this.docCur = true;
      this.curName = file.name;
    }
  }

  uploadDocument(tipo: string, campo: string) {
    const formData = new FormData();

    formData.append(tipo, this.curForm.get(campo)?.value!);
    this.archivosService.setDoc(tipo, formData).subscribe({
      next: (res: any) => {
        console.log(res);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  get nombre() { return this.curForm.get('nombre'); }
  get tipo() { return this.curForm.get('tipo'); }
  get fecha_fin() { return this.curForm.get('fecha_fin'); }
  get institucion() { return this.curForm.get('institucion'); }
  get duracion() { return this.curForm.get('duracion'); }
  get constancia() { return this.curForm.get('constancia'); }
}
