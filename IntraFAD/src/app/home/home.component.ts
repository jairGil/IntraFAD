import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Profile } from './models/profile.model';
import { PersonalDataService } from './services/personal-data.service';
import { AuthService } from '../auth/services/auth.service';
import { Docente } from './models/docente.model';

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
  public profileDocente: Profile | undefined = undefined;
  public dataDocente!: Docente;

  constructor(
    private renderer: Renderer2,
    private personalDataService: PersonalDataService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getDocente();
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
   * Datos recibidos del componente **PersonalDataComponent**
   * @param data - Datos del perfil del docente
   */
  receiveDataFromChild(data: Profile) {
    this.profileDocente = data;
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

        this.profileDocente = {
          nombre: res.docente.nombre,
          apellido_p: res.docente.apellido_p,
          apellido_m: res.docente.apellido_m,
          img: res.docente.img,
        }
      },
      error: (err: any) => console.log(err)
    });
  }
}
