import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Certification } from 'src/app/home/models/certification.model';
import { FileSend } from 'src/app/home/models/file-send.model';
import { ArchivosService } from 'src/app/home/services/archivos.service';
import { CertificationsService } from 'src/app/home/services/certifications.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-certifications',
  templateUrl: './certifications.component.html',
  styleUrls: ['./certifications.component.scss', '../../data-sheet.component.scss', '../../../../home.component.scss']
})
export class CertificationsComponent {
  private idDocente: any;
  public modo_agregar = false;
  public certificaciones: any;
  public certName: String | null = null;

  certForm = this.formBuilder.group({
    nombre: ['', Validators.required],
    institucion: ['', Validators.required],
    fecha: ['', Validators.required],
    constancia: ['', Validators.required]
  });

  constructor(
    private authService: AuthService,
    private certificacionService: CertificationsService,
    public archivosService: ArchivosService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
    ) {
      this.idDocente = this.authService.decodeToken()._id;
    }

  ngOnInit(): void {
    this.getCert();
    this.modo_agregar = false;
  }

  /**
   * Obtiene las certificaciones del docente
   * @since 1.0.0
   * @version 1.0.0
   * @returns void
   */
  private getCert(): void {
    this.certificacionService.getCertificaciones(this.idDocente).subscribe({
      next: (res: any) => {
        this.certificaciones = res.certificaciones;
        this.notificationService.showNotification(res.msg, res.code);
      }, 
      error: (err: any) => {
        console.log(err);
        this.notificationService.showNotification(err.error.msg, 500);
      }
    });
  }

  /**
   * Eliminar una certificación
   * @param id ID de la certificación a eliminar
   * @returns void
   * @since 1.0.0
   * @version 1.0.0
   */
  public deleteCert(id: string): void {
    this.certificacionService.deleteCertificacion(id).subscribe({
      next: (res: any) => {
        this.getCert();
        this.notificationService.showNotification(res.msg, res.code);
      },
      error: (err: any) => {
        this.notificationService.showNotification(err.error.msg, 500);
      }
    });
  }
  
  /**
   * Envia los datos de la certificación al servidor
   * @returns void
   * @since 1.0.0
   * @version 1.0.0
   */
  public async enviarDatos(): Promise<void> {
    const institucion = this.certForm.get('institucion')?.value!;
    const nombre = this.certForm.get('nombre')?.value!;
    const fecha = new Date(this.certForm.get('fecha')?.value!);

    let certification: Certification = {
      nombre: nombre,
      institucion: institucion,
      fecha: new Date(fecha),
      id_docente: this.idDocente
    }

    try {
      const res = await firstValueFrom(this.certificacionService.addCertificacion(certification));
      if (res.code === 200) {
        const service = this.certificacionService;
        const certFile = this.createFileSend('certificacion', institucion, nombre, fecha);
        const fieldValue = this.certForm.get('constancia')?.value!;
        const idFT = res.idFT;
        await this.archivosService.updateDocInService(service, certFile, fieldValue, idFT);
      }
      this.notificationService.showNotification(res.msg, res.code);
    } catch (err: any) {
      this.notificationService.showNotification(err.error, 500);
    }

    this.getCert();
    this.cambiarModo(2);
    this.certName = null;
    this.certForm.reset();
  }

  /**
   * Crea un objeto de tipo FileSend
   * @param type Tipo de archivo
   * @param institucion Institución de la certificación
   * @param nombre Nombre de la certificación
   * @param fecha Fecha de la certificación
   * @returns Objeto de tipo FileSend
   * @since 1.0.1
   * @version 1.0.0
   */
  private createFileSend(type: string, institucion: string, nombre: string, fecha: Date): FileSend {
    const fileName = `${institucion}_${nombre}`;
    const dateStr = fecha.toISOString().slice(0, 10).replace(/-/g, '_');
    return {
      type: type,
      name: fileName,
      date: dateStr,
    };
  }

  /**
   * Cambia el modo de la vista
   * @param modo Modo de la vista
   * @returns void
   * @since 1.0.0
   * @version 1.0.0
   */
  public cambiarModo(modo: number) {
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
   * @param event Evento de selección de archivo
   * @returns void
   * @since 1.0.0
   * @version 1.0.0
   */
  public onCertificacionSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.certForm.get('constancia')?.setValue(file);
      this.certName = file.name;
    }
  }

  get nombre() { return this.certForm.get('nombre'); }
  get institucion() { return this.certForm.get('institucion'); }
  get fecha() { return this.certForm.get('fecha'); }
  get constancia() { return this.certForm.get('constancia'); }
}
