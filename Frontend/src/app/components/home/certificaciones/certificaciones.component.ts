import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ArchivosService } from 'src/app/services/archivos.service';
import { CertificacionesService } from 'src/app/services/certificaciones.service';

@Component({
  selector: 'app-certificaciones',
  templateUrl: './certificaciones.component.html',
  styleUrls: ['../../../app.component.css','./certificaciones.component.scss']
})
export class CertificacionesComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<object>();
  @Input() token_data: any;

  public modo_agregar = false;
  public certificaciones: any;
  public URL_DOC = 'http://localhost:3000/api/documento/get-document/';

  public docCert: boolean = false;

  certForm = this.formBuilder.group({
    nombre: ['', Validators.required],
    institucion: ['', Validators.required],
    fecha: ['', Validators.required],
    constancia: ['', Validators.required]
  });

  constructor(
    private certificacionService: CertificacionesService,
    private archivosService: ArchivosService,
    private formBuilder: FormBuilder
    ) { }

  ngOnInit(): void {
    this.getCert();
    this.modo_agregar = false;
  }

  getCert() {
    this.certificacionService.getCertificaciones(this.token_data.id).subscribe(
      (res: any) => {
        this.certificaciones = res.certificacion;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  deleteCert(id: string) {
    this.certificacionService.deleteCertificacion(id).subscribe(
      (res: any) => {
        this.getCert();
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
    this.uploadDocument('certificacion', 'constancia_f');


    console.log(this.certForm.value);
    this.certificacionService.addCertificacion(this.certForm.value).subscribe(
      (res: any) => {
        console.log(res);
      },
      (err: any) => {
        console.log(err);
      }
    );

  }

  onCertificacionSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.certForm.get('constancia')?.setValue(file);
      this.docCert = true;
    }
  }

  uploadDocument(tipo: string, campo: string) {
    const formData = new FormData();

    formData.append(tipo, this.certForm.get(campo)?.value!);
    this.archivosService.setDoc(tipo, this.token_data.id, formData).subscribe(
      (res: any) => {
        console.log(res);
      },
      (err: any) => {
        console.log(err);
      });
  }

  get nombre() { return this.certForm.get('nombre'); }
  get institucion() { return this.certForm.get('institucion'); }
  get fecha() { return this.certForm.get('fecha'); }
  get constancia() { return this.certForm.get('constancia'); }

}
