import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Experience } from 'src/app/home/models/experience.model';
import { ArchivosService } from 'src/app/home/services/archivos.service';
import { ExperiencesService } from 'src/app/home/services/experiences.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-experiences',
  templateUrl: './experiences.component.html',
  styleUrls: ['./experiences.component.scss', '../../data-sheet.component.scss', '../../../../home.component.scss']
})
export class ExperiencesComponent {
  private idDocente: any;
  public URL_DOC = environment.URL_DOC;
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
    private archivosService: ArchivosService,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.idDocente = this.authService.decodeToken()._id;
  }

  ngOnInit(): void {
    this.getExperiences();
    this.modo_agregar = false;
  }

  getExperiences() {
    this.experienceService.getExperiencias(this.idDocente).subscribe({
      next: (res: any) => {
        this.experiencias = res.experiencias;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  deleteExperience(id: string) {
    this.experienceService.deleteExperiencia(id).subscribe({
      next: (res: any) => {
        this.getExperiences();
      },
      error: (err: any) => {
        console.log(err);
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
        if (res.value) {
          this.getExperiences();
          this.cambiarModo(2);
        }
      },
      error: (err: any) => {
        console.log(err);
      }
    });

  }

  get puesto() { return this.expForm.get('puesto'); }
  get empresa() { return this.expForm.get('empresa'); }
  get fecha_ingreso() { return this.expForm.get('fecha_ingreso'); }
  get fecha_egreso() { return this.expForm.get('fecha_egreso'); }
  get funciones() { return this.expForm.get('funciones'); }
  get observaciones() { return this.expForm.get('observaciones'); }
}
