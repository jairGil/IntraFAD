import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Course } from 'src/app/home/models/course.model';
import { FileSend } from 'src/app/home/models/file-send.model';
import { ArchivosService } from 'src/app/home/services/archivos.service';
import { CoursesService } from 'src/app/home/services/courses.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss', '../../data-sheet.component.scss', '../../../../home.component.scss']
})
export class CoursesComponent {
  private idDocente: any;
  public modo_agregar = false;
  public cursos: any;
  public curName: String | null = null;

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
    public archivosService: ArchivosService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.idDocente = this.authService.decodeToken()._id;
  }

  ngOnInit(): void {
    this.getCursos();
    this.modo_agregar = false;
  }

  /**
   * Obtiene los cursos del docente
   * @since 1.0.0
   * @version 1.0.0
   * @returns void
   */
  private getCursos(): void {
    this.cursoService.getCursos(this.idDocente).subscribe({
      next: (res: any) => {
        this.cursos = res.cursos;
        this.notificationService.showNotification(res.msg, res.code);
      },
      error: (err: any) => {
        this.notificationService.showNotification(err.error.msg, 500);
      }
    });
  }

  /**
   * Elimina un curso
   * @param id ID del curso
   * @since 1.0.0
   * @version 1.0.0
   */
  public deleteCurso(id: string): void {
    this.cursoService.deleteCurso(id).subscribe({
      next: (res: any) => {
        this.getCursos();
        this.notificationService.showNotification(res.msg, res.code);
      },
      error: (err: any) => {
        this.notificationService.showNotification(err.error.msg, 500);
      }
    });
  }

  /**
   * Envia los datos del curso
   * @since 1.0.0
   * @version 1.0.0
   * @returns void
   */
  public async enviarDatos(): Promise<void> {
    const nombre = this.curForm.get('nombre')?.value!;
    const tipo = this.curForm.get('tipo')?.value!;
    const institucion = this.curForm.get('institucion')?.value!;
    const fechaObtencion = new Date(this.curForm.get('fecha_fin')?.value!);
    const duracion = this.curForm.get('duracion')?.value!;

    let curso: Course = {
      nombre: nombre,
      tipo: tipo,
      fecha_fin: new Date(fechaObtencion),
      institucion: institucion,
      duracion: Number(duracion),
      id_docente: this.idDocente
    }

    try {
      const res = await firstValueFrom(this.cursoService.addCurso(curso));

      if (res.code === 200) {
        const fileData: FileSend = this.createFileSend('cursos', institucion, tipo, nombre, fechaObtencion);
        const fieldValue = this.curForm.get('constancia')?.value!;
        const service = this.cursoService;
        const idFT = res.idFT;
        await this.archivosService.updateDocInService(service, fileData, fieldValue, idFT);
      }

      this.notificationService.showNotification(res.msg, res.code);
    } catch (err: any) {
      this.notificationService.showNotification(err, 500);
    }

    this.getCursos();
    this.cambiarModo(2);
    this.curName = null;
    this.curForm.reset();
  }

  /**
   * Crear el objeto para enviar el archivo
   * @param type Tipo de archivo
   * @param institucion Institucion emisora
   * @param tipo Tipo de curso
   * @param nombre Nombre del curso
   * @param fechaObtencion Fecha de obtencion del curso
   * @returns (FileSend) Objeto para enviar el archivo
   */
  private createFileSend(type: string, institucion: string, tipo: string, nombre: string, fechaObtencion: Date): FileSend {
    const fileName = `${institucion}_${tipo}_${nombre}`;
    const dateStr = fechaObtencion.toISOString().slice(0, 10).replace(/-/g, '_');
    return {
      type: type,
      name: fileName,
      date: dateStr,
    };
  }

  /**
   * Cambia el modo de la vista
   * @param modo Modo de la vista
   * @since 1.0.0
   * @version 1.0.0
   * @returns void
   */
  public cambiarModo(modo: number): void {
    switch (modo) {
      case 1:
        this.modo_agregar = true;
        break;
      case 2:
        this.modo_agregar = false;
        break;
    }
  }

  /**
   * Obtener el archivo del input file
   * @param event Evento del input file
   * @since 1.0.0
   * @version 1.0.0
   * @returns void
   */
  public onCursoSelect(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.curForm.get('constancia')?.setValue(file);
      this.curName = file.name;
    }
  }

  get nombre() { return this.curForm.get('nombre'); }
  get tipo() { return this.curForm.get('tipo'); }
  get fecha_fin() { return this.curForm.get('fecha_fin'); }
  get institucion() { return this.curForm.get('institucion'); }
  get duracion() { return this.curForm.get('duracion'); }
  get constancia() { return this.curForm.get('constancia'); }
}
