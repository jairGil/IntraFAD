import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Certification } from 'src/app/home/models/certification.model';
import { FileSend } from 'src/app/home/models/file-send.model';
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
  public certName: String | null = null;
  public loading: boolean = false;
  public msg: string = '';

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

  public async enviarDatos() {
    // this.uploadDocument('certificacion', 'constancia_f');

    let certification: Certification = {
      nombre: this.certForm.get('nombre')?.value!,
      institucion: this.certForm.get('institucion')?.value!,
      fecha: new Date(this.certForm.get('fecha')?.value!),
      id_docente: this.idDocente
    }

    try {
      const res = await firstValueFrom(this.certificacionService.addCertificacion(certification));
      if (res.code === 200) {

        if (this.certName != null) {
          // Datos del archivo
          const fileData: FileSend = {
            type: 'certificacion',
            name: this.certForm.get('institucion')?.value! + '_' + this.certForm.get('nombre')?.value!,
            date: new Date(this.certForm.get('fecha')?.value!).toISOString().slice(0, 10).replace(/-/g, "_"),
          }
          // Subir el archivo
          await this.updateAcademicDataDoc(fileData, 'constancia', res.idFT);
        }

        this.getCert();
        this.cambiarModo(2);
        this.notificationService.showNotification(res.msg, 'alert-success');
      }
    } catch (err: any) {
      let error = "Ha ocurrido un error";
      this.notificationService.showNotification(error, 'alert-danger');
    }

    this.certName = null;
  }

  onCertificacionSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.certForm.get('constancia')?.setValue(file);
      this.docCert = true;
      this.certName = file.name;
    }
  }

  private async updateAcademicDataDoc(fileData: FileSend, campo: string, idFT: string): Promise<void> {
    const fieldValue = this.certForm.get(campo)?.value;

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

    this.certificacionService.updateCertificacion(updateQuery).subscribe({
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

  get nombre() { return this.certForm.get('nombre'); }
  get institucion() { return this.certForm.get('institucion'); }
  get fecha() { return this.certForm.get('fecha'); }
  get constancia() { return this.certForm.get('constancia'); }
}
