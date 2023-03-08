import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ArchivosService } from 'src/app/home/services/archivos.service';
import { LanguagesService } from 'src/app/home/services/languages.service';
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
    private formBuilder: FormBuilder
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
        this.idiomas = res.idioma;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  deleteLanguage(id: string) {
    this.languageService.deleteIdioma(id).subscribe({
      next: (res: any) => {
        this.getLanguages();
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
    this.uploadDocument('idiomas', 'constancia_F');

    this.languageService.addIdioma(this.idioForm.value).subscribe({
      next: (res: any) => {
        console.log(res);
      },
      error: (err: any) => {
        console.log(err);
      }
    });

  }

  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.idioForm.get('certificado')?.setValue(file);
      this.docIdioma = true;
    }
  }

  uploadDocument(tipo: string, campo: string) {
    const formData = new FormData();

    formData.append(tipo, this.idioForm.get(campo)?.value!);
    this.archivosService.setDoc(tipo, formData).subscribe({
      next: (res: any) => {
        console.log(res);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  get nombre() { return this.idioForm.get('nombre'); }
  get nivel() { return this.idioForm.get('nivel'); }
  get fecha_fin() { return this.idioForm.get('fecha_fin'); }
  get institucion() { return this.idioForm.get('institucion'); }
  get certificado() { return this.idioForm.get('certificado'); }
}
