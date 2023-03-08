import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { ArchivosService } from './services/archivos.service';
import { PersonalDataService } from './services/personal-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  @ViewChild("btnDP") btnDP: ElementRef | undefined;
  @ViewChild("btnDA") btnDA: ElementRef | undefined;

  public pagina = 0;
  public editar = false;
  public imagen: any;
  public dataDocente: any;

  constructor(
    private renderer: Renderer2,
    private authService: AuthService,
    private personalDataService: PersonalDataService,
    private archivosService: ArchivosService
  ) {
      this.getDocente();
      this.getImage();
   }

  ngOnInit(): void {
    this.getDocente();
    console.log("DATOS IZQ: " + JSON.stringify(this.dataDocente));
  }

  /**
   * Cambiar la página que se muestra en el componente
   * @param pag (number )Referencia a la página que se desea mostrar
   * @returns void
  */
  public switchPage(pag: number): void {
    switch (pag) {
      case 0:
        this.editar = false;
        this.renderer.addClass(this.btnDP?.nativeElement, "btn-outline-success");
        this.renderer.removeClass(this.btnDA?.nativeElement, "btn-outline-success");
        break;
      case 1:
        this.editar = false;
        this.renderer.removeClass(this.btnDP?.nativeElement, "btn-outline-success");
        this.renderer.addClass(this.btnDA?.nativeElement, "btn-outline-success");
        break;
    }
    this.pagina = pag;
  }

  /**
   * Obtener la imagen desde el servidor
   * @returns void
  */
  public getImage(): void {
    this.archivosService.getImage().subscribe({
      next: (data: any) => {
        this.createImageFromBlob(data);
      },
      error: (error: any) => {
        console.log('Error', error);
      }
  });
  }

  /**
   * Cargar una iamgen del dispositivo del usuario en el componente
   * @param image (Blob) Imagen en formato Blob
   * @returns void
   */
  public createImageFromBlob(image: Blob): void {
    let reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.imagen = reader.result;
      },
      false
    );
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  /**
   * Obtiene todos los datos del docente
   * @returns void
   * @since 1.0.0
   * @version 1.0.0
   * @private
   */
  private getDocente(): void {
    this.personalDataService.getDocente(this.authService.decodeToken()._id).subscribe({
      next: (res: any) => {
        this.dataDocente = res.docente;
      },
      error: (err: any) => console.log(err)
    });
  }
}
