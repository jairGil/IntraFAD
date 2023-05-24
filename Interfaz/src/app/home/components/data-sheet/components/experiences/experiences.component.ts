import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Experience } from 'src/app/home/models/experience.model';
import { ExperiencesService } from 'src/app/home/services/experiences.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-experiences',
  templateUrl: './experiences.component.html',
  styleUrls: ['./experiences.component.scss', '../../data-sheet.component.scss', '../../../../home.component.scss']
})
export class ExperiencesComponent {
  private idDocente: any;
  public modo_agregar = false;
  public experiencias: any;

  expForm = this.formBuilder.group({
    puesto: ['', Validators.required],
    empresa: ['', Validators.required],
    fecha_ingreso: ['', Validators.required],
    fecha_egreso: ['', Validators.required],
    funciones: ['', Validators.required],
    observaciones: ['',]
  });

  constructor(
    private experienceService: ExperiencesService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.idDocente = this.authService.decodeToken()._id;
  }

  ngOnInit(): void {
    this.getExperiences();
    this.modo_agregar = false;
  }

  /**
   * Obtiene las experiencias del docente
   * @since 1.0.0
   * @version 1.0.0
   * @returns void
   */
  private getExperiences(): void {
    this.experienceService.getExperiencias(this.idDocente).subscribe({
      next: (res: any) => {
        this.experiencias = res.experiencias;
        this.notificationService.showNotification(res.msg, res.code);
      },
      error: (err: any) => {
        this.notificationService.showNotification(err.error.msg, 500);
      }
    });
  }

  /**
   * Elimina una experiencia del docente
   * @param id ID de la experiencia a eliminar
   * @returns void
   * @since 1.0.0
   * @version 1.0.0
   */
  public deleteExperience(id: string): void {
    this.experienceService.deleteExperiencia(id).subscribe({
      next: (res: any) => {
        this.getExperiences();
        this.notificationService.showNotification(res.msg, res.code);
      },
      error: (err: any) => {
        this.notificationService.showNotification(err.error.msg, 500);
      }
    });
  }

  /**
   * Envía los datos de la experiencia a agregar
   * @returns void
   * @since 1.0.0
   * @version 1.0.0
   */
  public enviarDatos(): void {
    let experiencia: Experience = {
      puesto: this.expForm.get('puesto')?.value!,
      empresa: this.expForm.get('empresa')?.value!,
      fecha_ingreso: new Date(this.expForm.get('fecha_ingreso')?.value!),
      fecha_egreso: new Date(this.expForm.get('fecha_egreso')?.value!),
      funciones: this.expForm.get('funciones')?.value!,
      observaciones: this.expForm.get('observaciones')?.value!,
      id_docente: this.idDocente
    }

    this.experienceService.addExperiencia(experiencia).subscribe({
      next: (res: any) => {
        this.notificationService.showNotification(res.msg, res.code);
      },
      error: (err: any) => {
        this.notificationService.showNotification(err.error.msg, 500);
      }
    });

    this.getExperiences();
    this.cambiarModo(2);
    this.expForm.reset();
  }
  
  /**
   * Cambia el modo de la vista
   * @param modo Modo de la vista
   * @returns void
   * @since 1.0.0
   * @version 1.0.0
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

  get puesto() { return this.expForm.get('puesto'); }
  get empresa() { return this.expForm.get('empresa'); }
  get fecha_ingreso() { return this.expForm.get('fecha_ingreso'); }
  get fecha_egreso() { return this.expForm.get('fecha_egreso'); }
  get funciones() { return this.expForm.get('funciones'); }
  get observaciones() { return this.expForm.get('observaciones'); }
}
