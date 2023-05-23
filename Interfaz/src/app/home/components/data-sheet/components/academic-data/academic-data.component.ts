import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AcademicData } from 'src/app/home/models/academic-data.model.';
import { FileSend } from 'src/app/home/models/file-send.model';
import { QueryUpdate } from 'src/app/home/models/query-update.model';
import { AcademicDataService } from 'src/app/home/services/academic-data.service';
import { ArchivosService } from 'src/app/home/services/archivos.service';
import { NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-academic-data',
  templateUrl: './academic-data.component.html',
  styleUrls: ['./academic-data.component.scss', '../../data-sheet.component.scss', '../../../../home.component.scss']
})
export class AcademicDataComponent {
  private idDocente: any;
  public URL_DOC = environment.URL_DOC;
  public modo_agregar = false;
  public datosAcademicos: any;
  public docGradAcad: boolean = false;
  public docCedProf: boolean = false;
  public gaFilename: any = "-";
  public cpFilename: any = "-";
  public loading: boolean = false;
  public msg: string = '';

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
    private archivosService: ArchivosService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.idDocente = this.authService.decodeToken()._id;
  }

  ngOnInit(): void {
    this.getDA();
    this.modo_agregar = false;
  }

  public async getDA(): Promise<void> {
    this.loading = true;
    try {
      let res = await firstValueFrom(this.daService.getDatosAcademicos(this.idDocente));

      if (res.code === 200) {
        this.datosAcademicos = res.datoAcademico;
      }
      this.loading = false;
      this.notificationService.showNotification(res.msg, res.code);
    } catch(err: any) {
      this.loading = false;
      this.notificationService.showNotification(err.error.msg, 500);
    }

    this.loading = false;
  }

  deleteDA(id: string) {
    this.loading = true;
    this.daService.deleteDatoAcademico(id).subscribe({
      next: (res: any) => {
        this.getDA();
        this.loading = false;
        this.notificationService.showNotification(res.msg, res.code);
      },
      error: (err: any) => {
        this.loading = false;
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

    let idFT = null;
    this.loading = true;
    this.msg = 'Enviando datos...';
  
    try {
      const res = await firstValueFrom(this.daService.addDatoAcademico(academicData));
      if (res.code === 200) { 
        const gradoAcadFile = this.createFileSend('gradoAcad', gradoAcad, gradoObtenido, fechaObtencion);
        const cedProfFile = this.createFileSend('cedulaProf', gradoAcad, gradoObtenido, fechaObtencion);
        
        idFT = res.idFT;

        await Promise.allSettled([
          this.gaFilename != null && this.updateAcademicDataDoc(gradoAcadFile, 'doc_grado_acad', idFT),
          this.cpFilename != null && this.updateAcademicDataDoc(cedProfFile, 'doc_ced_prof', idFT),
        ]);
  
        await this.getDA();
        this.cambiarModo(2);
        this.loading = false;
        this.notificationService.showNotification(res.msg, res.code);
      }
    } catch (err: any) {
      this.loading = false;
      this.notificationService.showNotification(err.error.msg, 500);
    }
  
    this.gaFilename = null;
    this.cpFilename = null;
  }
  
  private createFileSend(type: string, gradoAcad: string, gradoObtenido: string, fechaObtencion: Date): FileSend {
    const fileName = `${gradoAcad}_${gradoObtenido}`;
    const dateStr = fechaObtencion.toISOString().slice(0, 10).replace(/-/g, '_');
    return {
      type: type,
      name: fileName,
      date: dateStr,
    };
  }

  onGradoAcadSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.daForm.get('doc_grado_acad')?.setValue(file);
      this.docGradAcad = true;
      this.gaFilename = file.name;
    }
  }

  onCedProfSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.daForm.get('doc_ced_prof')?.setValue(file);
      this.docCedProf = true;
      this.cpFilename = file.name;
    }
  }

  /**
   * Actualiza el documento de un dato academico
   * @param fileData Datos del archivo a subir
   * @param campo Campo del formulario en el que se encuentra el documento
   * @since 1.0.1
   * @version 1.0.0
   */
  private async updateAcademicDataDoc(fileData: FileSend, campo: string, idFT: string): Promise<void> {
    const fieldValue = this.daForm.get(campo)?.value;

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

    this.daService.updateDatoAcademico(updateQuery).subscribe({
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

  get grado_academico() { return this.daForm.get('grado_academico'); }
  get grado_obtenido() { return this.daForm.get('grado_obtenido'); }
  get doc_grado_acad() { return this.daForm.get('doc_grado_acad'); }
  get institucion_emisora() { return this.daForm.get('institucion_emisora'); }
  get fecha_obtencion() { return this.daForm.get('fecha_obtencion'); }
  get cedula_profesional() { return this.daForm.get('cedula_profesional'); }
  get doc_ced_prof() { return this.daForm.get('doc_ced_prof'); }
}
