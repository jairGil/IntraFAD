import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Profile } from './models/profile.model';

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
  public dataDocente: Profile | undefined = undefined;

  constructor(
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void { }

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
   * Datos recibidos del componente **PersonalDataComponent**
   * @param data - Datos del perfil del docente
   */
  receiveDataFromChild(data: Profile) {
    this.dataDocente = data;
  }
}
