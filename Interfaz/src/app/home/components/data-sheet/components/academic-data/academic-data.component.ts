import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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

  daForm = this.formBuilder.group({
    grado_academico: ['', Validators.required],
    grado_obtenido: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
    doc_grado_acad: ['', Validators.required],
    institucion_emisora: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
    fecha_obtencion: ['', Validators.required],
    cedula_profesional: ['', [Validators.required, Validators.maxLength(8), Validators.minLength(7)]],
    doc_ced_prof: ['', Validators.required],
    id_docente: ['', Validators.required]
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
    this.daForm.get('id_docente')?.setValue(this.idDocente);
  }

  getDA() {
    this.daService.getDatosAcademicos(this.idDocente).subscribe({
      next: (res: any) => {
        this.datosAcademicos = res.datoAcademico;
        // console.log(this.datosAcademicos);
        this.notificationService.showNotification(res.msg, 'alert-success');
      },
      error: (err: any) => {
        console.log(err);
        this.notificationService.showNotification(err.error.msg, 'alert-danger');
      }
    });
  }

  deleteDA(id: string) {
    this.daService.deleteDatoAcademico(id).subscribe({
      next: (res: any) => {
        this.getDA();
        // console.log(res);
        this.notificationService.showNotification(res.msg, 'alert-success');
      },
      error: (err: any) => {
        // console.log(err);
        this.notificationService.showNotification(err.error.msg, 'alert-danger');
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

  // TODO: subir datos a la bd primero, luego documentos y luego URLs
  enviarDatos() {
    // let uploaded:boolean = false;
    // let idFT: string = "";
    // let gradoAcadFile: FileSend = {
    //   type: "gradoAcad",
    //   name: this.daForm.get('grado_academico')?.value! + this.daForm.get('grado_obtenido')?.value!,
    //   date: new Date(this.daForm.get('fecha_obtencion')?.value!).toISOString().slice(0, 10)
    // }

    // let cedProfFile: FileSend = {
    //   type: "cedulaProf",
    //   name: this.daForm.get('grado_academico')?.value! + this.daForm.get('grado_obtenido')?.value!,
    //   date: new Date(this.daForm.get('fecha_obtencion')?.value!).toISOString().slice(0, 10)
    // }

    let datoAcad: AcademicData = {
      grado_academico: this.daForm.get('grado_academico')?.value!,
      grado_obtenido: this.daForm.get('grado_obtenido')?.value!,
      institucion_emisora: this.daForm.get('institucion_emisora')?.value!,
      fecha_obtencion: new Date(this.daForm.get('fecha_obtencion')?.value!),
      cedula_profesional: this.daForm.get('cedula_profesional')?.value!,
      id_docente: this.idDocente,
      validado: false
    }

    //console.log(this.daForm.get('doc_grado_acad')?.value);
    this.daService.addDatoAcademico(datoAcad).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res.value) {
          // idFT = res.idFT;
          // uploaded = true;
          this.getDA();
          this.cambiarModo(2);
          this.notificationService.showNotification(res.msg, 'alert-success');
        }
      },
      error: (err: any) => {
        // console.log(err);
        this.notificationService.showNotification(err.error.msg, 'alert-danger');
      }
    });

    // console.log("Uploaded" + uploaded);
    // console.log("idFT" + idFT)
    // //Subimos los documentos rfc y curp
    // if (uploaded) {
    //   if(this.gaFilename != null)
    //   this.uploadDocument(gradoAcadFile, 'doc_grado_acad', idFT);
    //   if(this.cpFilename != null)
    //   this.uploadDocument(cedProfFile, 'doc_ced_prof', idFT);
      
    //   this.getDA();
    //   this.cambiarModo(2);
    // }
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

  /** Subir archivos de ficha tecnica
   * @param fileData Datos del archivo a subir
   * @param campo Campo del formulario que se va a actualizar
   * @since 1.1.0
   * @version 1.1.0
   */
  uploadDocument(fileData: FileSend, campo: string, idFT: string){
    //FormData para subir el archivo
    const formData = new FormData();
    const fieldValue = this.daForm.get(campo)?.value;
    const paramName = fileData.type == "gradoAcad" ? "grado_acad" : "ced_prof";

    if (fieldValue !== null && fieldValue !== undefined) {
      formData.append(fileData.type, fieldValue);
      //Llama da al microservicio para subir el archivo
      this.archivosService.setFTDoc(formData, fileData).subscribe({
        next: (res: any) => {
          //Si se subiío correctamente el documento se actualiza la base de datos
          if(res.code === 200){
            const updateQuery: QueryUpdate= {
              id: idFT, 
              params: { [`doc_${paramName}`]: res.doc}
            }; 
            
            //Actualizar en base de datos
            this.daService.updateDatoAcademico(updateQuery).subscribe({
              next: (res: any) => {
                console.log(res);
              },
              error: (err: any) => {
                console.log(err);
              }
            });
            
            //Se limpian los campos de los documentos
            this.gaFilename = null;
            this.cpFilename = null;
          }
        },
        error: (err: any) => {
          console.log(err);
        }
      });
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
