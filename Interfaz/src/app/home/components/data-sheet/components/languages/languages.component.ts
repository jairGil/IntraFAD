import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FileSend } from 'src/app/home/models/file-send.model';
import { Language } from 'src/app/home/models/language.model';
import { ArchivosService } from 'src/app/home/services/archivos.service';
import { LanguagesService } from 'src/app/home/services/languages.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss', '../../data-sheet.component.scss', '../../../../home.component.scss']
})
export class LanguagesComponent {
  private idDocente: any;
  public modo_agregar = false;
  public idiomas: any;
  public docName: string | null = null;

  idioForm = this.formBuilder.group({
    nombre: ['', Validators.required],
    nivel: ['', Validators.required],
    fecha_fin: ['', Validators.required],
    institucion: ['', Validators.required],
    certificado: ['', Validators.required]
  });

  constructor(
    private languageService: LanguagesService,
    public archivosService: ArchivosService,
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

  /**
   * Obtiene los idiomas del docente
   * @since 1.0.0
   * @version 1.0.0
   * @returns void
   */
  private getLanguages(): void {
    this.languageService.getIdiomas(this.idDocente).subscribe({
      next: (res: any) => {
        this.idiomas = res.idiomas;
        this.notificationService.showNotification(res.msg, res.code);
      },
      error: (err: any) => {
        this.notificationService.showNotification(err.error.msg, 500);
      }
    });
  }

  /**
   * Elimina un idioma del docente
   * @param id Id del idioma
   * @since 1.0.0
   * @version 1.0.0
   * @returns void
   */
  public deleteLanguage(id: string): void {
    this.languageService.deleteIdioma(id).subscribe({
      next: (res: any) => {
        this.getLanguages();
        this.notificationService.showNotification(res.msg, res.code);
      },
      error: (err: any) => {
        this.notificationService.showNotification(err.error.msg, 500);
      }
    });
  }

  /**
   * Enviar los datos del formulario
   * @since 1.0.0
   * @version 1.0.1
   * @returns void
   */
  public async enviarDatos(): Promise<void> {
    const nombre = this.idioForm.get('nombre')?.value!;
    const nivel = this.idioForm.get('nivel')?.value!;
    const fecha_fin = new Date(this.idioForm.get('fecha_fin')?.value!);
    const institucion = this.idioForm.get('institucion')?.value!;

    let idioma: Language = {
      nombre: nombre,
      nivel: nivel,
      fecha_fin: fecha_fin,
      institucion: institucion,
      id_docente: this.idDocente
    }

    try {
      const res = await firstValueFrom(this.languageService.addIdioma(idioma));

      if (res.code === 200) {
        const service = this.languageService
        const fileData = this.createFileSend('idioma', institucion, nivel, nombre, fecha_fin);
        const fieldValue = this.idioForm.get('certificado')?.value!;
        const idFT = res.idFT;
        await this.archivosService.updateDocInService(service, fileData, fieldValue, idFT);
      }
      
      this.notificationService.showNotification(res.msg, res.code);
    } catch (err) {
      let error = "Ha ocurrido un error al enviar los datos";
      this.notificationService.showNotification(error, 500);
    }

    this.getLanguages();
    this.cambiarModo(2);
    this.docName = null;
    this.idioForm.reset();
  }

  /**
   * Crear el objeto para enviar el archivo
   * @param type Tipo de archivo
   * @param institucion Institucion emisora
   * @param nivel Tipo de curso
   * @param nombre Nombre del curso
   * @param fechaObtencion Fecha de obtencion del curso
   * @returns (FileSend) Objeto para enviar el archivo
   */
  private createFileSend(type: string, institucion: string, nivel: string, nombre: string, fechaObtencion: Date): FileSend {
    const fileName = `${institucion}_${nivel}_${nombre}`;
    const dateStr = fechaObtencion.toISOString().slice(0, 10).replace(/-/g, '_');
    return {
      type: type,
      name: fileName,
      date: dateStr,
    };
  }

  /**
   * Cambia el modo de la vista
   * @param modo Modo de la vista
   * @since 1.0.0
   * @version 1.0.0
   * @returns void
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

  /**
   * Obtener el archivo seleccionado
   * @param event Evento del input file
   * @since 1.0.0
   * @version 1.0.0
   * @returns void
   */
  public onFileSelect(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.idioForm.get('certificado')?.setValue(file);
      this.docName = file.name;
    }
  }

  get nombre() { return this.idioForm.get('nombre'); }
  get nivel() { return this.idioForm.get('nivel'); }
  get fecha_fin() { return this.idioForm.get('fecha_fin'); }
  get institucion() { return this.idioForm.get('institucion'); }
  get certificado() { return this.idioForm.get('certificado'); }
}
