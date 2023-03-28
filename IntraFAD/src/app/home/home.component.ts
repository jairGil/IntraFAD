import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Profile } from './models/profile.model';
import { PersonalDataService } from './services/personal-data.service';
import { AuthService } from '../auth/services/auth.service';
import { Docente } from './models/docente.model';
import { ArchivosService } from './services/archivos.service';
import { FormUtils } from './utils/FormUtils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  @ViewChild("btnDP") btnDP: ElementRef | undefined;
  @ViewChild("btnDA") btnDA: ElementRef | undefined;

  public loadingData: number = 0;
  public msg:string = "Obteniendo datos...";

  public pagina = 0;
  public editar = false;
  public profileDocente!: Profile;
  public dataDocente!: Docente;
  public imagen: any;

  constructor(
    private renderer: Renderer2,
    private personalDataService: PersonalDataService,
    private authService: AuthService,
    private archivosService: ArchivosService
  ) { }

  ngOnInit() {
    this.getDocente();
  }

  /**
   * Cambiar la página que se muestra en el componente
   * @param pag (number) Referencia a la página que se desea mostrar
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
   * @returns void
   * @since 1.1.0
   * @version 1.1.0
   */
  receiveDataFromChild(data: Profile): void {
    this.profileDocente = data;
    this.getDocente();
  }

  /**
   * Obtiene todos los datos del docente
   * @returns void
   * @since 1.0.0
   * @version 1.0.0
   * @private
   */
  private async getDocente(): Promise<void> {
    this.imagen = await this.archivosService.getImageSrc();
    this.loadingData = 1;
    this.personalDataService.getDocente(this.authService.decodeToken()._id).subscribe({
      next: (res: any) => {
        this.dataDocente = FormUtils.cleanDataDocente(res.docente);

        this.profileDocente = {
          nombre: res.docente.nombre,
          apellido_p: res.docente.apellido_p,
          apellido_m: res.docente.apellido_m,
          img: this.imagen,
        }

        this.loadingData = 2;
      },
      error: (err: any) => console.log(err)
    });
  }

  /**
   * Esperar la carga de los datos en el componente
   * @returns (boolean) - true si los datos se han cargado, false en caso contrario
   * @since 1.1.0
   * @version 1.0.0
   */
  public loaded(): boolean {
    return this.loadingData == 2;
  }
}
