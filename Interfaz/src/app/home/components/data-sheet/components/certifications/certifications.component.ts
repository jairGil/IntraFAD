import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Certification } from 'src/app/home/models/certification.model';
import { ArchivosService } from 'src/app/home/services/archivos.service';
import { CertificationsService } from 'src/app/home/services/certifications.service';
import { NotificationService } from 'src/app/services/notification.service';
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
  public certName!: String;

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
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
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
        this.certificaciones = res.certificaciones;
        this.notificationService.showNotification(res.msg, 'alert-success');
      },
      error: (err: any) => {
        // console.log(err);
        this.notificationService.showNotification(err.error.msg, 'alert-danger');
      }
    });
  }

  deleteCert(id: string) {
    this.certificacionService.deleteCertificacion(id).subscribe({
      next: (res: any) => {
        this.getCert();
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

  enviarDatos() {
    // this.uploadDocument('certificacion', 'constancia_f');

    let certificacion: Certification = {
      nombre: this.certForm.get('nombre')?.value!,
      institucion: this.certForm.get('institucion')?.value!,
      fecha: new Date(this.certForm.get('fecha')?.value!),
      constancia: "No_inicializado.pdf",
      id_docente: this.idDocente
    }

    this.certificacionService.addCertificacion(certificacion).subscribe({
      next: (res: any) => {
        if (res.value) {
          this.getCert();
          this.cambiarModo(2);
          this.notificationService.showNotification(res.msg, 'alert-success');
        }
      },
      error: (err: any) => {
        // console.log(err);
        this.notificationService.showNotification(err.error.msg, 'alert-danger');
      }
    });
  }

  onCertificacionSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.certForm.get('constancia')?.setValue(file);
      this.docCert = true;
      this.certName = file.name;
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
