import { Component, Input, ElementRef, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { ArchivosService } from 'src/app/services/archivos.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', '../../app.component.css']
})
export class HomeComponent {

  @ViewChild("btnDP") btnDP: ElementRef | undefined;
  @ViewChild("btnDA") btnDA: ElementRef | undefined;

  public pagina = 0;
  public editar = false;
  public imagen: any;
  public token_data: any;

  constructor(
    private renderer: Renderer2,
    private loginService: LoginService,
    private archivosService: ArchivosService
  ) {
      this.getImage();
   }

  ngOnInit(): void {
    this.token_data = this.loginService.decodeToken();
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
      next: (data) => {
        this.createImageFromBlob(data);
      },
      error: (error) => {
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
}
