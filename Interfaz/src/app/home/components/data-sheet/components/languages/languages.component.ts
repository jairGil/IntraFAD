import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FileSend } from 'src/app/home/models/file-send.model';
import { Language } from 'src/app/home/models/language.model';
import { ArchivosService } from 'src/app/home/services/archivos.service';
import { LanguagesService } from 'src/app/home/services/languages.service';
import { NotificationService } from 'src/app/services/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss', '../../data-sheet.component.scss', '../../../../home.component.scss']
})
export class LanguagesComponent {
  private idDocente: any;
  public URL_DOC = environment.URL_DOC;
  public modo_agregar = false;
  public idiomas: any;
  public docIdioma: boolean = false;
  public docName: string | null = null;

  public loading: boolean = false;
  public msg: string = '';

  idioForm = this.formBuilder.group({
    nombre: ['', Validators.required],
    nivel: ['', Validators.required],
    fecha_fin: ['', Validators.required],
    institucion: ['', Validators.required],
    certificado: ['', Validators.required]
  });

  constructor(
    private languageService: LanguagesService,
    private archivosService: ArchivosService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.idDocente = this.authService.decodeToken()._id;
  }

  ngOnInit(): void {
    this.getLanguages();
    this.modo_agregar = false;
  }

  getLanguages() {
    this.languageService.getIdiomas(this.idDocente).subscribe({
      next: (res: any) => {
        this.idiomas = res.idiomas;
        this.notificationService.showNotification(res.msg, res.code);
      },
      error: (err: any) => {
        // console.log(err);
        this.notificationService.showNotification(err.error.msg, 500);
      }
    });
  }

  deleteLanguage(id: string) {
    this.languageService.deleteIdioma(id).subscribe({
      next: (res: any) => {
        this.getLanguages();
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

  public async enviarDatos() {
    // this.uploadDocument('idiomas', 'constancia_F');

    let idioma: Language = {
      nombre: this.idioForm.get('nombre')?.value!,
      nivel: this.idioForm.get('nivel')?.value!,
      fecha_fin: new Date(this.idioForm.get('fecha_fin')?.value!),
      institucion: this.idioForm.get('institucion')?.value!,
      // certificado: "no_inicializado.pdf",
      id_docente: this.idDocente
    }

    try {
      const res = await firstValueFrom(this.languageService.addIdioma(idioma));

      if (res.code === 200) {
        if (this.docName != null) {
          // Datos del archivo
          const fileData: FileSend = {
            type: 'idioma',
            name: this.idioForm.get('institucion')?.value! + '_' + this.idioForm.get('nivel')?.value! + '_' + this.idioForm.get('nombre')?.value!,
            date: new Date(this.idioForm.get('fecha_fin')?.value!).toISOString().slice(0, 10).replace(/-/g, "_"),
          }
          // Subir el archivo
          await this.updateAcademicDataDoc(fileData, 'certificado', res.idFT);
        }
      }
      
      this.getLanguages();
      this.cambiarModo(2);
      this.notificationService.showNotification(res.msg, res.code);
    } catch (err) {
      let error = "Ha ocurrido un error al enviar los datos";
      this.notificationService.showNotification(error, 500);
    }
  }

  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.idioForm.get('certificado')?.setValue(file);
      this.docIdioma = true;
      this.docName = file.name;
    }
  }

  private async updateAcademicDataDoc(fileData: FileSend, campo: string, idFT: string): Promise<void> {
    const fieldValue = this.idioForm.get(campo)?.value;

    if (!fieldValue) {
      return;
    }

    const formData = new FormData();
    formData.append(fileData.type, fieldValue);

    this.loading = true;
    this.msg = 'Subiendo documentos...';

    const updateQuery = await this.archivosService.uploadDocument(fileData, fieldValue, idFT);

    if (!updateQuery) {
      return;
    }

    this.languageService.updateIdioma(updateQuery).subscribe({
      next: (res: any) => {
        console.log(res);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  public showDoc(dir: String): void {
    this.archivosService.getIDDoc(dir)
      .subscribe(
        data => {
          const file = new Blob([data], { type: 'application/pdf' });
          const fileURL = URL.createObjectURL(file);
          window.open(fileURL);
        }
      )
  }

  get nombre() { return this.idioForm.get('nombre'); }
  get nivel() { return this.idioForm.get('nivel'); }
  get fecha_fin() { return this.idioForm.get('fecha_fin'); }
  get institucion() { return this.idioForm.get('institucion'); }
  get certificado() { return this.idioForm.get('certificado'); }
}
