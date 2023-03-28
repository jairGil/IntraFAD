/** ANGULAR CORE, FORMS, RXJS */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

/** ENVIRONMENT */
import { environment } from 'src/environments/environment.development';

/** SERVICES */
import { ArchivosService } from '../../services/archivos.service';
import { PersonalDataService } from '../../services/personal-data.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { StaticDataService } from '../../services/static-data.service';

/** MODELS */ 
import { Profile } from '../../models/profile.model';
import { Docente } from '../../models/docente.model';
import { FormUtils } from '../../utils/FormUtils';

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.scss', '../../../app.component.scss', '../../home.component.scss']
})
export class PersonalDataComponent {
  /** (Input) Docente - Recibe datos de **HomeComponent** */
  @Input() dataDocente!: Docente;

  /** (Output) EventEmmiter<Profile> - Salida de datos para comunicación con **HomeComponent** */
  @Output() dataEmitter = new EventEmitter<Profile>();

  /* STATIC ARRAYS */
  public listaEstados = StaticDataService.listaEstados;
  public listaEmpleos = StaticDataService.listaEmpleos;
  
  public URL_IMG = environment.URL_IMG;
  public URL_DOC = environment.URL_DOC;

  currentFile?: File;
  fileInfos?: Observable<any>;
  
  public edicion = false;
  public direccion: any;
  public imgSrc: any;
  public rfcFilename: any = '-';
  public curpFilename: any = '-';
  public imagen: any;
  private urlCurp: String = '';
  private urlRfc: String = '';

  public dpForm: FormGroup = new FormGroup({});
  private imgForm: FormData = new FormData();

  public loading: boolean = false;
  public msg: string = 'Guardando datos...';


  constructor(
    private authService: AuthService,
    private personalDataService: PersonalDataService,
    private archivosService: ArchivosService
  ) { }

  ngOnInit() {
    this.direccion = this.dataDocente.direccion.split(', ');
    this.dpForm = FormUtils.buildForm();
    this.dpForm = FormUtils.setDataDocente(this.dpForm, this.dataDocente);
  }

  /**
   * Genera las peticiónes para subir los documentos y los datos del docente al servidor
   * @returns void
   * @since 1.0.0
   * @version 1.0.0
  */
  public enviarDatos(): void {
    this.loading = true;
    this.uploadImage();
    // this.urlRfc = this.uploadDocument('rfc', 'doc_rfc');
    // this.urlCurp = this.uploadDocument('curp', 'doc_curp');
    
    let docente: Docente = {
      _id: this.dataDocente._id,
      img: this.dataDocente.img,
      nombre: this.dpForm.get('nombre')?.value!,
      apellido_p: this.dpForm.get('apellido_p')?.value!,
      apellido_m: this.dpForm.get('apellido_m')?.value!,
      direccion: FormUtils.makeDireccion(this.dpForm),
      correo_personal: this.dpForm.get('correo_personal')?.value!,
      correo_institucional: this.dpForm.get('correo_institucional')?.value!,
      telefono: this.dpForm.get('telefono')?.value!,
      rfc: this.dpForm.get('rfc')?.value!,
      // doc_rfc: this.uploadDocument('rfc', 'doc_rfc'),
      doc_rfc: '-data-' + this.dataDocente._id + '-RFC-' + this.dataDocente._id + '.pdf',
      curp: this.dpForm.get('curp')?.value!,
      doc_curp: '-data-' + this.dataDocente._id + '-CURP-' + this.dataDocente._id + '.pdf',
      no_empleado: this.dpForm.get('no_empleado')?.value!,
      ldg: this.dpForm.get('ldg')?.value!,
      ldi: this.dpForm.get('ldi')?.value!,
      arq: this.dpForm.get('arq')?.value!,
      apou: this.dpForm.get('apou')?.value!,
      rol: 'USER_ROLE',
      tipoContrato: this.dpForm.get('tipoContrato')?.value!,
      contratoDefinitivo: this.dpForm.get('contratoDefinitivo')?.value!
    };

    this.personalDataService.updateDocente(docente).subscribe({
      next: (res: any) => {
        this.sendDataToParent();
        this.cambiar_modo(1);
        this.loading = false;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  /** 
   * Evento de cambio de imagen 
   * @param event
   * @returns void
   * @since 1.0.0
   * @version 1.0.0
   */
  public onImageSelect(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      this.imgForm.append('img', file);
      /* ACTUALIZAR IMAGEN EN LA INTERFAZ */
      const reader = new FileReader();
      reader.onload = (e) =>
        (this.imgSrc = reader.result);
      reader.readAsDataURL(file);

      /*********************************/
      this.dpForm.get('img')?.setValue(file);
    }
  }

  /** 
   * Evento de cambio de archivo de RFC
   * @param event
   * @returns void
   * @since 1.0.0
   * @version 1.0.0
   */
  onRFCSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.dpForm.get('doc_rfc')?.setValue(file);
      this.rfcFilename = file.name;
    }
  }

  /** 
   * Evento de cambio de archivo de CURP
   * @param event
   * @returns void
   * @since 1.0.0
   * @version 1.0.0
   */
  onCURPSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.dpForm.get('doc_curp')?.setValue(file);
      this.curpFilename = file.name;
    }
  }

  /** 
   * Envio de imagen al servidor
   * @returns void
   * @since 1.0.0
   * @version 1.0.0
   */
  private uploadImage(): void {
    this.archivosService.uploadImage(this.imgForm).subscribe({
      next: (res: any) => {
        this.dataDocente.img = res.img;
        this.dpForm.get('img')?.setValue(res.img);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  /**
   * Envio de documentos al servidor
   * @returns string
   * @param tipo (string) - Tipo de documento
   * @param campo (string) - Campo del formulario
   * @since 1.0.0
   * @version 1.0.0
   * @private
   */
  private uploadDocument(tipo: string, campo: string): string {
    const formData = new FormData();
    let doc = '**';

    formData.append(tipo, this.dpForm.get(campo)?.value!);
    this.archivosService.setDoc(tipo, formData).subscribe({
      next: (res: any) => {
        if (tipo == 'rfc') this.dataDocente.doc_rfc = res.doc;
        if (tipo == 'curp') this.dataDocente.doc_curp = res.doc;
        this.dpForm.get(campo)?.setValue(res.doc);
        doc = res.doc;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
    return doc;
  }

  /**
   * Obtener el documento del servidor
   * @returns string
   * @param type (string) - Tipo de documento
   * @since 1.0.0
   * @version 1.0.0
   * @private
   */
  getDocument(type: string): string {
    switch (type) {
      case 'rfc':
        return this.URL_DOC + 'get-document/' + this.dataDocente.doc_rfc;
      case 'curp':
        return this.URL_DOC + 'get-document/' + this.dataDocente.doc_curp;
      default:
        return '';
    }
  }

  showDoc(type: string) {
    switch (type) {
      case 'rfc':
        return this.archivosService.getDoc(this.dataDocente.doc_rfc)
      case 'curp':
        return this.archivosService.getDoc(this.dataDocente.doc_curp)
      default:
        return '';
    }
  }


  /**
   * Intercambiar el modo edicion y visualizacion
   * @returns void
   * @param modo (number) - Modo de la vista (1: visualizacion, 2: edicion)
   * @since 1.0.0
   * @version 1.0.0
   */
  public async cambiar_modo(modo: number): Promise<void> {
    switch (modo) {
      case 1:
        this.direccion = this.dataDocente.direccion.split(', ');
        this.edicion = false;
        break;
      case 2:
        this.imagen = await this.archivosService.getImageSrc();
        FormUtils.setDataDocente(this.dpForm, this.dataDocente);
        this.edicion = true;
        break;
    }
  }

  /**
   * Comunicar los datos obtenidos de la API Docente para la visualización del perfil de usuario
   */
  public sendDataToParent(): void {
    let profile: Profile = {
      img: this.imagen,
      nombre: this.dataDocente.nombre,
      apellido_p: this.dataDocente.apellido_p,
      apellido_m: this.dataDocente.apellido_m
    }
    this.dataEmitter.emit(profile);
  }

  get nombre() { return this.dpForm.get('nombre'); }
  get apellido_p() { return this.dpForm.get('apellido_p'); }
  get apellido_m() { return this.dpForm.get('apellido_m'); }
  get calle() { return this.dpForm.get('calle'); }
  get no_ext() { return this.dpForm.get('no_ext'); }
  get no_int() { return this.dpForm.get('no_int'); }
  get colonia() { return this.dpForm.get('colonia'); }
  get estado() { return this.dpForm.get('estado'); }
  get municipio() { return this.dpForm.get('municipio'); }
  get cp() { return this.dpForm.get('cp'); }
  get correo_personal() { return this.dpForm.get('correo_personal'); }
  get correo_institucional() { return this.dpForm.get('correo_institucional'); }
  get telefono() { return this.dpForm.get('telefono'); }
  get rfc() { return this.dpForm.get('rfc'); }
  get doc_rfc() { return this.dpForm.get('doc_rfc'); }
  get curp() { return this.dpForm.get('curp'); }
  get doc_curp() { return this.dpForm.get('doc_curp'); }
  get no_empleado() { return this.dpForm.get('no_empleado'); }
  get ldg() { return this.dpForm.get('ldg'); }
  get ldi() { return this.dpForm.get('ldi'); }
  get arq() { return this.dpForm.get('arq'); }
  get apou() { return this.dpForm.get('apou'); }
  get tipoContrato() { return this.dpForm.get('tipoContrato'); }
  get contratoDefinitivo() { return this.dpForm.get('contratoDefinitivo'); }
}
