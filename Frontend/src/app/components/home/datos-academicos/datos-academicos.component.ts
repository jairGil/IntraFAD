import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ArchivosService } from 'src/app/services/archivos.service';
import { DaDocenteService } from 'src/app/services/da-docente.service';

@Component({
  selector: 'app-datos-academicos',
  templateUrl: './datos-academicos.component.html',
  styleUrls: ['../../../app.component.css', './datos-academicos.component.scss']
})
export class DatosAcademicosComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<object>();
  @Input() token_data: any;

  public modo_agregar = false;
  public datosAcademicos: any;
  public URL_DOC = 'http://localhost:3000/api/documento/get-document/';

  public docGradAcad: boolean = false;
  public docCedProf: boolean = false;

  daForm = this.formBuilder.group({
    grado_academico: ['', Validators.required],
    grado_obtenido: ['', Validators.required],
    doc_grado_acad: ['', Validators.required],
    institucion_emisora: ['', Validators.required],
    fecha_obtencion: ['', Validators.required],
    cedula_profesional: ['', Validators.required],
    doc_ced_prof: ['', Validators.required]
  });

  constructor(
    private daService: DaDocenteService,
    private archivosService: ArchivosService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getDA();
    this.modo_agregar = false;
  }


  getDA() {
    this.daService.getDatosAcademicos(this.token_data.id).subscribe(
      (res: any) => {
        this.datosAcademicos = res.datoAcademico;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  deleteDA(id: string) {
    this.daService.deleteDatoAcademico(id).subscribe(
      (res: any) => {
        this.getDA();
      },
      (err: any) => {
        console.log(err);
      }
    );
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
    this.uploadDocument('gradoAcad', 'doc_grado_acad');
    this.uploadDocument('cedulaProf', 'doc_ced_prof');

    console.log(this.daForm.value);
    this.daService.addDatoAcademico(this.daForm.value).subscribe(
      (res: any) => {
        console.log(res);
      },
      (err: any) => {
        console.log(err);
      }
    );

  }

  onGradoAcadSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.daForm.get('doc_grado_acad')?.setValue(file);
      this.docGradAcad = true;
    }
  }

  onCedProfSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.daForm.get('doc_ced_prof')?.setValue(file);
      this.docCedProf = true;
    }
  }

  uploadDocument(tipo: string, campo: string) {
    const formData = new FormData();

    formData.append(tipo, this.daForm.get(campo)?.value!);
    this.archivosService.setDoc(tipo, this.token_data.id, formData).subscribe(
      (res: any) => {
        console.log(res);
      },
      (err: any) => {
        console.log(err);
      });
  }

  get grado_academico() { return this.daForm.get('grado_academico'); }
  get grado_obtenido() { return this.daForm.get('grado_obtenido'); }
  get doc_grado_acad() { return this.daForm.get('doc_grado_acad'); }
  get institucion_emisora() { return this.daForm.get('institucion_emisora'); }
  get fecha_obtencion() { return this.daForm.get('fecha_obtencion'); }
  get cedula_profesional() { return this.daForm.get('cedula_profesional'); }
  get doc_ced_prof() { return this.daForm.get('doc_ced_prof'); }
}

