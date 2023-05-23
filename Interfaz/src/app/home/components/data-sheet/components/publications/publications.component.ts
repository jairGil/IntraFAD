import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Publication } from 'src/app/home/models/publication.model';
import { ArchivosService } from 'src/app/home/services/archivos.service';
import { PublicationsService } from 'src/app/home/services/publications.service';
import { NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.scss', '../../data-sheet.component.scss', '../../../../home.component.scss']
})
export class PublicationsComponent {
  private idDocente: any;
  public URL_DOC = environment.URL_DOC;
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
    private archivosService: ArchivosService,
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

  getPublications() {
    this.publicationService.getPublicaciones(this.idDocente).subscribe({
      next: (res: any) => {
        this.publicaciones = res.publicaciones;
        this.notificationService.showNotification(res.msg, res.code);
      },
      error: (err: any) => {
        // console.log(err);
        this.notificationService.showNotification(err.error.msg, 500);
      }
    });
  }

  deletePublication(id: string) {
    this.publicationService.deletePublicacion(id).subscribe({
      next: (res: any) => {
        this.getPublications();
        this.notificationService.showNotification(res.msg, res.code);
      },
      error: (err: any) => {
        // console.log(err);
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

  enviarDatos() {

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
        this.getPublications();
        this.cambiarModo(2);
        this.notificationService.showNotification(res.msg, res.code);
      },
      error: (err: any) => {
        // console.log(err);
        this.notificationService.showNotification(err.error.msg, 500);
      }
    });

  }

  get formato() { return this.pubForm.get('formato'); }
  get tipo() { return this.pubForm.get('tipo'); }
  get autores() { return this.pubForm.get('autores'); }
  get fecha_pub() { return this.pubForm.get('fecha_pub'); }
  get titulo() { return this.pubForm.get('titulo'); }
  get editorial() { return this.pubForm.get('editorial'); }
  get doi_url() { return this.pubForm.get('doi_url'); }
}
