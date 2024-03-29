/** ANGULAR CORE, FORMS, RXJS */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, firstValueFrom } from 'rxjs';

/** SERVICES */
import { ArchivosService } from '../../services/archivos.service';
import { PersonalDataService } from '../../services/personal-data.service';
import { StaticDataService } from '../../services/static-data.service';

/** MODELS */ 
import { Profile } from '../../models/profile.model';
import { Docente, DocenteSend } from '../../models/docente.model';
import { FormUtils } from '../../utils/FormUtils';
import { PlanEstudio } from '../../models/plan-estudio.model';
import { QueryUpdate } from '../../models/query-update.model';
import { NotificationService } from 'src/app/services/notification.service';
import { FileSend } from '../../models/file-send.model';

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
  public listaEstados = StaticDataService.LISTA_ESTADOS;
  public listaEmpleos = StaticDataService.LISTA_EMPLEOS;
  public listaPlanesEstudio = StaticDataService.LISTA_PLANES_ESTUDIO;

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

  /** Variable auxilir que contiene los planes de estudio elegidos en la edicion */
  private planesEstudio: PlanEstudio[] = [];

  constructor(
    private personalDataService: PersonalDataService,
    public archivosService: ArchivosService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.direccion = this.dataDocente.direccion.split(', ');
    this.dpForm = FormUtils.buildForm();
    this.dpForm = FormUtils.setDataDocente(this.dpForm, this.dataDocente);
    this.loading = false;
  }

  /**
   * Obtener los datos de un docente por su id
   * @returns void
   * @since 1.0.0
   * @version 1.0.0
   */
  public async getDocente(): Promise<void> {
    this.loading = true;
    const docente = await firstValueFrom(this.personalDataService.getDocente(this.dataDocente._id));
    console.log(docente);
    this.dataDocente = docente;
    this.loading = false;
  }

  /**
   * Genera las peticiónes para subir los documentos y los datos del docente al servidor
   * @returns void
   * @since 1.0.0
   * @version 1.0.1
  */
  public async enviarDatos(): Promise<void> {
    this.loading = true;
    this.uploadImage();
    
    //Inicializamos docente  para actualizar solo los datos 
    let docente: DocenteSend = {
      nombre: this.dpForm.get('nombre')?.value!,
      apellido_p: this.dpForm.get('apellido_p')?.value!,
      apellido_m: this.dpForm.get('apellido_m')?.value!,
      direccion: FormUtils.makeDireccion(this.dpForm),
      correo_personal: this.dpForm.get('correo_personal')?.value!,
      correo_institucional: this.dpForm.get('correo_institucional')?.value!,
      telefono: this.dpForm.get('telefono')?.value!,
      rfc: this.dpForm.get('rfc')?.value!,
      curp: this.dpForm.get('curp')?.value!,
      no_empleado: this.dpForm.get('no_empleado')?.value!,
      planes_estudio: this.getPlanesEstudio(),
      tipoContrato: this.dpForm.get('tipoContrato')?.value!,
      contratoDefinitivo: this.dpForm.get('contratoDefinitivo')?.value!,
      rol: 'BASIC_ROLE', 
    };

    //Generamos un query para la actualización de los datos personales
    const updateQuery: QueryUpdate = {
      id: this.dataDocente._id, 
      params: docente
    };

    //Actualizamos en la base de datos los Datos personales
    try {
      const res = await firstValueFrom(this.personalDataService.updatePersonalData(updateQuery));
      if (res.code == 200) {
        this.sendDataToParent();
      }
      this.notificationService.showNotification(res.msg, res.code);
    } catch (err: any) {
      this.loading = false;
      this.notificationService.showNotification(err.error.msg, 500);
    }

    const service = this.personalDataService;
    const id = this.dataDocente._id.toString();
    //Subimos los documentos rfc y curp
    if (this.rfcFilename != null) {
      const fileData: FileSend = {
        type: 'rfc',
      };
      const fieldValue = this.dpForm.get('doc_rfc')?.value!;
      await this.archivosService.updateDocInService(service, fileData, fieldValue, id);
    }

    if (this.curpFilename != null) {
      // this.updatePersonalDataDoc({ type: 'curp' }, 'doc_curp');
      const fileData: FileSend = {
        type: 'curp',
      };
      const fieldValue = this.dpForm.get('doc_curp')?.value!;
      await this.archivosService.updateDocInService(service, fileData, fieldValue, id);
    }
    
    //Se limpian los campos de los documentos
    this.rfcFilename = null;
    this.curpFilename = null;
    this.loading = false;

    this.getDocente();
    this.cambiar_modo(1);
  }

  /**
   * Agregar planes de estudio que se eligieron en la edición
   * @returns Array<PlanEstudio> - Planes de estudio elegidos
   * @since 1.1.0
   * @version 1.1.0
   */
  public getPlanesEstudio(): Array<PlanEstudio> {
    let pe = [];
    for (const planEstudio of this.listaPlanesEstudio) {
      if (this.dpForm.get(planEstudio.clave)?.value) {
        pe.push(planEstudio);
      }
    }
    return pe;
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
  get LDG() { return this.dpForm.get('LDG'); }
  get LDI() { return this.dpForm.get('LDI'); }
  get ARQ() { return this.dpForm.get('ARQ'); }
  get APOU() { return this.dpForm.get('APOU'); }
  get AUAC() { return this.dpForm.get('AUAC'); }
  get VBI() { return this.dpForm.get('VBI'); }
  get MD() { return this.dpForm.get('MD'); }
  get MES() { return this.dpForm.get('MES'); }
  get DD() { return this.dpForm.get('DD'); }
  get DSFP() { return this.dpForm.get('DSFP'); }
  get tipoContrato() { return this.dpForm.get('tipoContrato'); }
  get contratoDefinitivo() { return this.dpForm.get('contratoDefinitivo'); }
}
