import { Component, EventEmitter, Output } from '@angular/core';
import { Docente } from '../../models/docente.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArchivosService } from '../../services/archivos.service';
import { PersonalDataService } from '../../services/personal-data.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { Profile } from '../../models/profile.model';

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.scss', '../../../app.component.scss', '../../home.component.scss']
})
export class PersonalDataComponent {
  /** 
   * @Output - Salida de datos para comunicación con **HomeComponent**
  */
  @Output() dataEmitter = new EventEmitter<Profile>();

  currentFile?: File;
  fileInfos?: Observable<any>;

  private regex_num = /^([0-9])*$/;
  private regex_institucional = /([a-z0-9]{3,})+\@+(profesor\.|)+(uaemex\.mx)/;
  private regex_personal = /([\w\.]+)@([\w\.]+)\.(\w+)/;
  
  public dataDocente: Docente = {
    _id: '',
    nombre: '',
    apellido_p: '',
    apellido_m: '',
    direccion: '',
    correo_personal: '',
    correo_institucional: '',
    telefono: '',
    rfc: '',
    doc_rfc: '',
    curp: '',
    doc_curp: '',
    img: '',
    no_empleado: '',
    rol: '',
    ldg: false,
    ldi: false,
    arq: false,
    apou: false,
    contratoDefinitivo: false,
    tipoContrato: ''
  };
  public edicion = false;
  public direccion: any;
  public imgSrc: any;
  public rfcFilename: any = '-';
  public curpFilename: any = '-';
  public imagen: any;
  private urlCurp: String = '';
  private urlRfc: String = '';
  private imgForm: FormData = new FormData();

  public URL_IMG = environment.URL_IMG;
  public URL_DOC = environment.URL_DOC;
  public dpForm: FormGroup = new FormGroup({});


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private personalDataService: PersonalDataService,
    private archivosService: ArchivosService
  ) {
    this.getDocente();
    this.getImage();
    this.initForm();
  }

  ngOnInit(): void {
    this.getDocente();
    this.direccion = this.dataDocente.direccion.split(', ');
    this.cleanToken();
  }

  /**
   * Inicializa el formulario de datos personales
   * @returns void
   * @private
   * @since 1.0.0
   * @version 1.0.0
   */
  private initForm(): void {
    this.dpForm = this.formBuilder.group({
      img: [''],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido_p: ['', [Validators.required, Validators.minLength(3)]],
      apellido_m: ['', [Validators.required, Validators.minLength(3)]],
      calle: ['', [Validators.required, Validators.minLength(3)]],
      no_ext: [''],
      no_int: [''],
      colonia: ['', [Validators.required, Validators.minLength(3)]],
      estado: ['', [Validators.required, Validators.minLength(3)]],
      municipio: ['', [Validators.required, Validators.minLength(3)]],
      cp: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.pattern(this.regex_num),
        ],
      ],
      correo_personal: [
        '',
        [Validators.pattern(this.regex_personal)],
      ],
      correo_institucional: ['', [Validators.pattern(this.regex_institucional)]],
      telefono: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.pattern(this.regex_num),
        ],
      ],
      rfc: [
        '',
        [Validators.required, Validators.minLength(12), Validators.maxLength(13)],
      ],
      doc_rfc: ['', [Validators.required]],
      curp: [
        '',
        [Validators.required, Validators.minLength(18), Validators.maxLength(18)],
      ],
      doc_curp: ['', [Validators.required]],
      no_empleado: [
        '',
        [Validators.maxLength(6), Validators.pattern(this.regex_num)],
      ],
      contratoDefinitivo: [false],
      tipoContrato: [''],
      ldg: [false],
      ldi: [false],
      arq: [false],
      apou: [false],
    });
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
        this.direccion = this.dataDocente.direccion.split(', ');
        this.sendDataToParent();
      },
      error: (err: any) => console.log(err)
    });
  }

  /**
   * Limpia los campos por defecto del token
   * @returns void
   * @since 1.0.0
   * @version 1.0.0
   */
  private cleanToken(): void {
    if (this.dataDocente.nombre == 'No ingresado') {
      this.dataDocente.nombre = '';
    }

    if (this.dataDocente.apellido_p == 'No ingresado') {
      this.dataDocente.apellido_p = '';
    }

    if (this.dataDocente.apellido_m == 'No ingresado') {
      this.dataDocente.apellido_m = '';
    }

    if (this.dataDocente.direccion == 'No ingresado') {
      this.dataDocente.direccion = '';
    }

    if (this.dataDocente.correo_personal == 'no_inicializado@mail.com') {
      this.dataDocente.correo_personal = '';
    }

    if (this.dataDocente.correo_institucional == 'no_inicializado@uaemex.com') {
      this.dataDocente.correo_institucional = '';
    }

    if (this.dataDocente.telefono == '0000000000') {
      this.dataDocente.telefono = '';
    }

    if (this.dataDocente.rfc == 'ABCD123456789') {
      this.dataDocente.rfc = '';
    }

    if (this.dataDocente.curp == 'ABCD123456EFGHIJK0') {
      this.dataDocente.curp = '';
    }
  }

  /**
   * Genera las peticiónes para subir los documentos y los datos del docente al servidor
   * @returns void
   * @since 1.0.0
   * @version 1.0.0
  */
  public enviarDatos(): void {
    this.uploadImage();
    this.urlRfc = this.uploadDocument('rfc', 'doc_rfc');
    this.urlCurp = this.uploadDocument('curp', 'doc_curp');

    let docente: Docente = {
      _id: this.dataDocente._id,
      img: this.dataDocente.img,
      nombre: this.dpForm.get('nombre')?.value!,
      apellido_p: this.dpForm.get('apellido_p')?.value!,
      apellido_m: this.dpForm.get('apellido_m')?.value!,
      direccion: this.getDireccion(),
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
        this.getDocente();
        this.cambiar_modo(1);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }


  /**
   * colocar los datos del docente en los campos del formulario
   * @returns void
   * @private
   * @since 1.0.0
   * @version 1.0.0
   */
  private setData(): void {
    if (this.dataDocente.nombre != 'No ingresado') {
      this.dpForm.get('nombre')?.setValue(this.dataDocente.nombre);
    }

    if (this.dataDocente.apellido_p != 'No ingresado') {
      this.dpForm.get('apellido_p')?.setValue(this.dataDocente.apellido_p);
    }

    if (this.dataDocente.apellido_m != 'No ingresado') {
      this.dpForm.get('apellido_m')?.setValue(this.dataDocente.apellido_m);
    }


    if (this.dataDocente.correo_personal != 'no_inicializado@mail.com') {
      this.dpForm
        .get('correo_personal')
        ?.setValue(this.dataDocente.correo_personal);
    }

    if (this.dataDocente.correo_institucional != 'no_inicializado@uaemex.com') {
      this.dpForm
        .get('correo_institucional')
        ?.setValue(this.dataDocente.correo_institucional);
    }

    if (this.dataDocente.telefono != '0000000000') {
      this.dpForm.get('telefono')?.setValue(this.dataDocente.telefono);
    }

    if (this.dataDocente.no_empleado != '0000000') {
      this.dpForm.get('no_empleado')?.setValue(this.dataDocente.no_empleado);
    }

    this.dpForm.get('img')?.setValue(this.dataDocente.img);
    this.dpForm.get('rfc')?.setValue(this.dataDocente.rfc);
    this.dpForm.get('curp')?.setValue(this.dataDocente.curp);
    this.dpForm.get('doc_rfc')?.setValue(this.dataDocente.doc_rfc);
    this.dpForm.get('doc_curp')?.setValue(this.dataDocente.doc_curp);
    this.dpForm.get('ldg')?.setValue(this.dataDocente.ldg);
    this.dpForm.get('ldi')?.setValue(this.dataDocente.ldi);
    this.dpForm.get('arq')?.setValue(this.dataDocente.arq);
    this.dpForm.get('apou')?.setValue(this.dataDocente.apou);
    this.dpForm.get('tipoContrato')?.setValue(this.dataDocente.tipoContrato);
    this.dpForm.get('contratoDefinitivo')?.setValue(this.dataDocente.contratoDefinitivo);

    this.rfcFilename = this.dataDocente.doc_rfc;
    this.curpFilename = this.dataDocente.doc_curp;
  }

  /**
   * Generar la dirección del docente
   * @returns string
   * @private
   * @since 1.0.0
   * @version 1.0.0
   */
  private getDireccion(): string {
    if (
      this.dpForm.get('no_ext')?.value == '' ||
      this.dpForm.get('no_ext')?.value == null
    ) {
      this.dpForm.get('no_ext')?.setValue('SN');
    }

    if (
      this.dpForm.get('no_int')?.value == '' ||
      this.dpForm.get('no_int')?.value == null
    ) {
      this.dpForm.get('no_int')?.setValue('SN');
    }

    return (
      this.dpForm.get('calle')?.value +
      ', ' +
      this.dpForm.get('no_ext')?.value +
      ', ' +
      this.dpForm.get('no_int')?.value +
      ', ' +
      this.dpForm.get('colonia')?.value +
      ', ' +
      this.dpForm.get('municipio')?.value +
      ', ' +
      this.dpForm.get('estado')?.value +
      ', ' +
      this.dpForm.get('cp')?.value
    );
  }

  /**
   * Colocar la dirección del docente en los campos del formulario
   * @returns void
   * @private
   * @since 1.0.0
   * @version 1.0.0
   */
  private setDomicilio(): void {
    if (this.direccion[0] != 'No ingresado') {
      this.dpForm.get('calle')?.setValue(this.direccion[0]);
      this.dpForm.get('no_ext')?.setValue(this.direccion[1]);
      this.dpForm.get('no_int')?.setValue(this.direccion[2]);
      this.dpForm.get('colonia')?.setValue(this.direccion[3]);
      this.dpForm.get('municipio')?.setValue(this.direccion[4]);
      this.dpForm.get('estado')?.setValue(this.direccion[5]);
      this.dpForm.get('cp')?.setValue(this.direccion[6]);
    }
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
   * Obtener la imagen del servidor y colocarla en la interfaz
   * @returns void
   * @since 1.0.0
   * @version 1.0.0
   * @private
   */
  private getImage(): void {
    this.archivosService.getImage().subscribe({
      next: (res: any) => {
        this.createImageFromBlob(res);
      },
      error: (err: any) => {
        this.imagen = 'assets/img/default.png';
        console.log('Error', err);
      }
    });
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
   * Crear imagen a partir de un Blob
   * @returns void
   * @param image (Blob) - Imagen en formato Blob
   * @since 1.0.0
   * @version 1.0.0
   * @private
   */
  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.imagen = reader.result;
      },
      false
    );
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  /**
   * Intercambiar el modo edicion y visualizacion
   * @returns void
   * @param modo (number) - Modo de la vista (1: visualizacion, 2: edicion)
   * @since 1.0.0
   * @version 1.0.0
   */
  public cambiar_modo(modo: number): void {
    switch (modo) {
      case 1:
        this.getDocente();
        this.direccion = this.dataDocente.direccion.split(', ');
        this.cleanToken();
        this.edicion = false;
        break;
      case 2:
        this.setData();
        this.setDomicilio();
        if (this.dataDocente.correo_institucional != "") {
          this.dpForm.controls['correo_institucional'].disable();
        }
        this.edicion = true;
        break;
    }
  }

  /**
   * Comunicar los datos obtenidos de la API Docente para la visualización del perfil de usuario
   */
  sendDataToParent() {
    let profile: Profile = {
      img: this.imagen,
      nombre: this.dataDocente.nombre,
      apellido_p: this.dataDocente.apellido_p,
      apellido_m: this.dataDocente.apellido_m
    }
    this.dataEmitter.emit(profile);
  }

  public listaEstados = [
    'Aguascalientes',
    'Baja California',
    'Baja California Sur',
    'Campeche',
    'Chiapas',
    'Chihuahua',
    'Cuidad de México',
    'Coahuila',
    'Colima',
    'Durango',
    'Guanajuato',
    'Guerrero',
    'Hidalgo',
    'Jalisco',
    'Estado de México',
    'Michoacán',
    'Morelos',
    'Nayarit',
    'Nuevo León',
    'Oaxaca',
    'Puebla',
    'Querétaro',
    'Quintana Roo',
    'San Luis Potosí',
    'Sinaloa',
    'Sonora',
    'Tabasco',
    'Tamaulipas',
    'Tlaxcala',
    'Veracruz',
    'Yucatán',
    'Zacatecas',
  ];

  public listaEmpleos = [ 
    "Profesor de asignatura",
    "Profesor tiempo completo",
    "Profesor medio tiempo",
    "Técnico académico de tiempo completo",
    "Técnico académico de medio tiempo"
];

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
