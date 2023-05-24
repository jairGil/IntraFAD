import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Publication } from 'src/app/home/models/publication.model';
import { PublicationsService } from 'src/app/home/services/publications.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.scss', '../../data-sheet.component.scss', '../../../../home.component.scss']
})
export class PublicationsComponent {
  private idDocente: any;
  public modo_agregar = false;
  public publicaciones: any;

  pubForm = this.formBuilder.group({
    formato: ['Impreso', Validators.required],
    tipo: ['Publicacion', Validators.required],
    autores: ['', Validators.required],
    fecha_pub: ['', Validators.required],
    titulo: ['', Validators.required],
    editorial: ['',],
    doi_url: ['',]
  });

  constructor(
    private publicationService: PublicationsService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.idDocente = this.authService.decodeToken()._id;
  }

  ngOnInit(): void {
    this.getPublications();
    this.modo_agregar = false;
  }

  /**
   * Obtiene las publicaciones del docente
   * @since 1.0.0
   * @version 1.0.0
   * @returns void
   */
  private getPublications(): void {
    this.publicationService.getPublicaciones(this.idDocente).subscribe({
      next: (res: any) => {
        this.publicaciones = res.publicaciones;
        this.notificationService.showNotification(res.msg, res.code);
      },
      error: (err: any) => {
        this.notificationService.showNotification(err.error.msg, 500);
      }
    });
  }

  /**
   * Elimina una publicacion del docente
   * @param id id de la publicacion
   * @since 1.0.0
   * @version 1.0.0
   * @returns void
   */
  public deletePublication(id: string): void {
    this.publicationService.deletePublicacion(id).subscribe({
      next: (res: any) => {
        this.getPublications();
        this.notificationService.showNotification(res.msg, res.code);
      },
      error: (err: any) => {
        this.notificationService.showNotification(err.error.msg, 500);
      }
    });
  }

  /**
   * Envia los datos de la publicacion al servicio
   * @since 1.0.0
   * @version 1.0.0
   * @returns void
   */
  public enviarDatos(): void {
    let publicacion: Publication = {
      formato: this.pubForm.get('formato')?.value!,
      tipo: this.pubForm.get('tipo')?.value!,
      autores: this.pubForm.get('autores')?.value!,
      fecha: new Date(this.pubForm.get('fecha_pub')?.value!),
      titulo: this.pubForm.get('titulo')?.value!,
      editorial: this.pubForm.get('editorial')?.value!,
      doi_url: this.pubForm.get('doi_url')?.value!,
      id_docente: this.idDocente
    }

    this.publicationService.addPublicacion(publicacion).subscribe({
      next: (res: any) => {
        this.notificationService.showNotification(res.msg, res.code);
      },
      error: (err: any) => {
        this.notificationService.showNotification(err.error.msg, 500);
      }
    });

    this.getPublications();
    this.cambiarModo(2);
    this.pubForm.reset();
  }

  /**
   * Cambia el modo de la vista
   * @param modo 1: modo agregar, 2: modo ver
   * @since 1.0.0
   * @version 1.0.0
   * @returns void
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

  get formato() { return this.pubForm.get('formato'); }
  get tipo() { return this.pubForm.get('tipo'); }
  get autores() { return this.pubForm.get('autores'); }
  get fecha_pub() { return this.pubForm.get('fecha_pub'); }
  get titulo() { return this.pubForm.get('titulo'); }
  get editorial() { return this.pubForm.get('editorial'); }
  get doi_url() { return this.pubForm.get('doi_url'); }
}
