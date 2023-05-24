import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AcademicData } from 'src/app/home/models/academic-data.model.';
import { FileSend } from 'src/app/home/models/file-send.model';
import { AcademicDataService } from 'src/app/home/services/academic-data.service';
import { ArchivosService } from 'src/app/home/services/archivos.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-academic-data',
  templateUrl: './academic-data.component.html',
  styleUrls: ['./academic-data.component.scss', '../../data-sheet.component.scss', '../../../../home.component.scss']
})
export class AcademicDataComponent {
  private idDocente: any;
  public modo_agregar = false;
  public datosAcademicos: any;
  public gaFilename: any = null;
  public cpFilename: any = null;

  daForm = this.formBuilder.group({
    grado_academico: ['', Validators.required],
    grado_obtenido: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
    doc_grado_acad: ['', Validators.required],
    institucion_emisora: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
    fecha_obtencion: ['', Validators.required],
    cedula_profesional: ['', [Validators.required, Validators.maxLength(8), Validators.minLength(7)]],
    doc_ced_prof: ['', Validators.required]
  });

  constructor(
    private authService: AuthService,
    private daService: AcademicDataService,
    public archivosService: ArchivosService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.idDocente = this.authService.decodeToken()._id;
  }

  ngOnInit(): void {
    this.getDA();
    this.modo_agregar = false;
  }

  /**
   * Obtener los datos academicos del docente
   * @since 1.0.0
   * @version 1.0.0
   * @return void
   */
  private async getDA(): Promise<void> {
    try {
      let res = await firstValueFrom(this.daService.getDatosAcademicos(this.idDocente));

      this.datosAcademicos = res.datoAcademico;
      this.notificationService.showNotification(res.msg, res.code);
    } catch(err: any) {
      this.notificationService.showNotification(err.error.msg, 500);
    }
  }

  /**
   * Eliminar un dato academico
   * @param id Identificador del dato academico
   * @since 1.0.0
   * @version 1.0.0
   * @return void
   */
  public deleteDA(id: string): void {
    this.daService.deleteDatoAcademico(id).subscribe({
      next: (res: any) => {
        this.getDA();
        this.notificationService.showNotification(res.msg, res.code);
      },
      error: (err: any) => {
        this.notificationService.showNotification(err.error.msg, 500);
      }
    });
  }

  /**
   * Enviar los datos del formulario al servicio
   * @returns void
   * @since 1.0.0
   * @version 1.0.1
   */
  public async enviarDatos(): Promise<void> {
    const gradoAcad = this.daForm.get('grado_academico')?.value ?? '';
    const gradoObtenido = this.daForm.get('grado_obtenido')?.value ?? '';
    const fechaObtencion = new Date(this.daForm.get('fecha_obtencion')?.value ?? '');
    const institucionEmisora = this.daForm.get('institucion_emisora')?.value ?? '';
    const cedulaProfesional = this.daForm.get('cedula_profesional')?.value ?? '';
   
    const academicData: AcademicData = {
      grado_academico: gradoAcad,
      grado_obtenido: gradoObtenido,
      institucion_emisora: institucionEmisora,
      fecha_obtencion: fechaObtencion,
      cedula_profesional: cedulaProfesional,
      id_docente: this.idDocente,
      validado: false,
    };
  
    try {
      const res = await firstValueFrom(this.daService.addDatoAcademico(academicData));
      if (res.code === 200) { 
        const service = this.daService;
        const gradoAcadFile = this.createFileSend('gradoAcad', gradoAcad, gradoObtenido, fechaObtencion);
        const gaFieldValue = this.daForm.get('doc_grado_acad')?.value!;
        const cedProfFile = this.createFileSend('cedulaProf', gradoAcad, gradoObtenido, fechaObtencion);
        const cpFieldValue = this.daForm.get('doc_ced_prof')?.value!;
        const idFT = res.idFT;

        await this.archivosService.updateDocInService(service , gradoAcadFile, gaFieldValue, idFT);
        await this.archivosService.updateDocInService(service , cedProfFile, cpFieldValue, idFT);
      }

      this.notificationService.showNotification(res.msg, res.code);
    } catch (err: any) {
      this.notificationService.showNotification(err.error.msg, 500);
    }
  
    await this.getDA();
    this.cambiarModo(2);
    this.gaFilename = null;
    this.cpFilename = null;
    this.daForm.reset();
  }
  
  /**
   * Crear un objeto de tipo FileSend
   * @param type Tipo de archivo
   * @param gradoAcad Grado academico
   * @param gradoObtenido Gradp obtenido
   * @param fechaObtencion Fecha de obtencion
   * @returns Datos del archivo en formato FileSend
   * @since 1.0.1
   * @version 1.0.0
   */
  private createFileSend(type: string, gradoAcad: string, gradoObtenido: string, fechaObtencion: Date): FileSend {
    const fileName = `${gradoAcad}_${gradoObtenido}`;
    const dateStr = fechaObtencion.toISOString().slice(0, 10).replace(/-/g, '_');
    return {
      type: type,
      name: fileName,
      date: dateStr,
    };
  }

  /**
   * Cambiar el modo del formulario
   * @param modo Modo del formulario
   * @returns void
   * @since 1.0.0
   * @version 1.0.0
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
   * Obtener el nombre del archivo seleccionado
   * @param event Evento de seleccion de archivo
   * @returns void
   * @since 1.0.0
   * @version 1.0.0
   */
  public onGradoAcadSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.daForm.get('doc_grado_acad')?.setValue(file);
      this.gaFilename = file.name;
    }
  }

  /**
   * Obtener el nombre del archivo seleccionado
   * @param event Evento de seleccion de archivo
   * @returns void
   * @since 1.0.0
   * @version 1.0.0
   */
  public onCedProfSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.daForm.get('doc_ced_prof')?.setValue(file);
      this.cpFilename = file.name;
    }
  }

  get grado_academico() { return this.daForm.get('grado_academico'); }
  get grado_obtenido() { return this.daForm.get('grado_obtenido'); }
  get doc_grado_acad() { return this.daForm.get('doc_grado_acad'); }
  get institucion_emisora() { return this.daForm.get('institucion_emisora'); }
  get fecha_obtencion() { return this.daForm.get('fecha_obtencion'); }
  get cedula_profesional() { return this.daForm.get('cedula_profesional'); }
  get doc_ced_prof() { return this.daForm.get('doc_ced_prof'); }
}
