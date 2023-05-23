import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Finality } from 'src/app/home/models/finality.model';
import { ArchivosService } from 'src/app/home/services/archivos.service';
import { FinalitiesService } from 'src/app/home/services/finalities.service';
import { NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-finalities',
  templateUrl: './finalities.component.html',
  styleUrls: ['./finalities.component.scss', '../../data-sheet.component.scss', '../../../../home.component.scss']
})
export class FinalitiesComponent {
  private idDocente: any;
  public URL_DOC = environment.URL_DOC;
  public modo_agregar = false;
  public definitividades: any;
  public docDefi: boolean = false;
  public defiName!: String;

  defiForm = this.formBuilder.group({
    licenciatura: ['', Validators.required],
    plan: ['', Validators.required],
    materia: ['', Validators.required],
    doc_def: ['', Validators.required]
  });

  constructor(
    private finalityService: FinalitiesService,
    private archivosService: ArchivosService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.idDocente = this.authService.decodeToken()._id;
  }

  ngOnInit(): void {
    this.getFinalities();
    this.modo_agregar = false;
  }

  getFinalities() {
    this.finalityService.getDefinitividades(this.idDocente).subscribe({
      next: (res: any) => {
        this.definitividades = res.definitividades;
        this.notificationService.showNotification(res.msg, res.code);
      },
      error: (err: any) => {
        // console.log(err);
        this.notificationService.showNotification(err.error.msg, 500);
      }
    });
  }

  deleteFinality(id: string) {
    this.finalityService.deleteDefinitividad(id).subscribe({
      next: (res: any) => {
        this.getFinalities();
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
    //Falta subir documento

    let definitividad: Finality = {
      licenciatura: this.defiForm.get('licenciatura')?.value!,
      plan: this.defiForm.get('plan')?.value!,
      materia: this.defiForm.get('materia')?.value!,
    }

    this.finalityService.addDefinitividad(definitividad).subscribe({
      next: (res: any) => {
        this.getFinalities();
        this.cambiarModo(2);
        this.notificationService.showNotification(res.msg, res.code);
      },
      error: (err: any) => {
        // console.log(err);
        this.notificationService.showNotification(err.error.msg, 500);
      }
    });

  }

  onDefinitividadSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.defiForm.get('doc_def')?.setValue(file);
      this.docDefi = true;
      this.defiName = file.name;
    }
  }

  uploadDocument(tipo: string, campo: string) {
    const formData = new FormData();

    formData.append(tipo, this.defiForm.get(campo)?.value!);
    this.archivosService.setDoc(tipo, formData).subscribe({
      next: (res: any) => {
        console.log(res);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  get licenciatura() { return this.defiForm.get('licenciatura'); }
  get plan() { return this.defiForm.get('plan'); }
  get materia() { return this.defiForm.get('materia'); }
  get doc_def() { return this.defiForm.get('doc_def'); }
}
