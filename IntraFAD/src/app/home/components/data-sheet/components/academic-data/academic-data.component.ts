import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AcademicDataService } from 'src/app/home/services/academic-data.service';
import { ArchivosService } from 'src/app/home/services/archivos.service';
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
    private formBuilder: FormBuilder
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
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  deleteDA(id: string) {
    this.daService.deleteDatoAcademico(id).subscribe({
      next: (res: any) => {
        this.getDA();
        console.log(res);
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

  // TODO: subir datos a la bd primero, luego documentos y luego URLs
  enviarDatos() {

    let datoAcad = {
      grado_academico: this.daForm.get('grado_academico')?.value,
      grado_obtenido: this.daForm.get('grado_obtenido')?.value,
      institucion_emisora: this.daForm.get('institucion_emisora')?.value,
      fecha_obtencion: this.daForm.get('fecha_obtencion')?.value,
      cedula_profesional: this.daForm.get('cedula_profesional')?.value,
      doc_grado_acad: "no_inicializado.pdf",
      doc_ced_prof: "no_inicializado.pdf",
      id_docente: this.idDocente,
      validado: false
    }

    //console.log(this.daForm.get('doc_grado_acad')?.value);
    this.daService.addDatoAcademico(datoAcad).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res.value) {
          // this.uploadDocument('gradoAcad', 'doc_grado_acad', res.idFT);
          // this.uploadDocument('cedulaProf', 'doc_ced_prof', res.idFT);
        }
      },
      error: (err: any) => {
        console.log(err);
      }
    });

    this.getDA();
    this.cambiarModo(2);
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

  // TODO: subir documentos a la bd
  // uploadDocument(tipo: string, campo: string, id: any) {
  //   const formData = new FormData();

  //   formData.append(tipo, this.daForm.get(campo)?.value!);
  //   this.archivosService.setDocFT(tipo, this.idDocente, id, formData).subscribe({
  //     next: (res: any) => {
  //       this.daForm.get(campo)?.setValue(res.doc);
  //       console.log("Dir: " + res.doc);
  //       console.log(this.daForm.get(campo)?.value)
  //       // return res.doc;	
  //     },
  //     error: (err: any) => {
  //       console.log(err);
  //     }
  //   });
  // }

  get grado_academico() { return this.daForm.get('grado_academico'); }
  get grado_obtenido() { return this.daForm.get('grado_obtenido'); }
  get doc_grado_acad() { return this.daForm.get('doc_grado_acad'); }
  get institucion_emisora() { return this.daForm.get('institucion_emisora'); }
  get fecha_obtencion() { return this.daForm.get('fecha_obtencion'); }
  get cedula_profesional() { return this.daForm.get('cedula_profesional'); }
  get doc_ced_prof() { return this.daForm.get('doc_ced_prof'); }
}
