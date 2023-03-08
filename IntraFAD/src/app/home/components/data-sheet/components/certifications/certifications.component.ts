import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ArchivosService } from 'src/app/home/services/archivos.service';
import { CertificationsService } from 'src/app/home/services/certifications.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-certifications',
  templateUrl: './certifications.component.html',
  styleUrls: ['./certifications.component.scss', '../../data-sheet.component.scss', '../../../../home.component.scss']
})
export class CertificationsComponent {
  private idDocente: any;
  public URL_DOC = environment.URL_DOC;
  public modo_agregar = false;
  public certificaciones: any;
  public docCert: boolean = false;

  certForm = this.formBuilder.group({
    nombre: ['', Validators.required],
    institucion: ['', Validators.required],
    fecha: ['', Validators.required],
    constancia: ['', Validators.required]
  });

  constructor(
    private authService: AuthService,
    private certificacionService: CertificationsService,
    private archivosService: ArchivosService,
    private formBuilder: FormBuilder
    ) {
      this.idDocente = this.authService.decodeToken()._id;
    }

  ngOnInit(): void {
    this.getCert();
    this.modo_agregar = false;
  }

  getCert() {
    this.certificacionService.getCertificaciones(this.idDocente).subscribe({
      next: (res: any) => {
        this.certificaciones = res.certificacion;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  deleteCert(id: string) {
    this.certificacionService.deleteCertificacion(id).subscribe({
      next: (res: any) => {
        this.getCert();
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
    this.uploadDocument('certificacion', 'constancia_f');


    console.log(this.certForm.value);
    this.certificacionService.addCertificacion(this.certForm.value).subscribe({
      next: (res: any) => {
        console.log(res);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
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
    this.archivosService.setDoc(tipo, formData).subscribe({
      next: (res: any) => {
        console.log(res);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  get nombre() { return this.certForm.get('nombre'); }
  get institucion() { return this.certForm.get('institucion'); }
  get fecha() { return this.certForm.get('fecha'); }
  get constancia() { return this.certForm.get('constancia'); }
}
