import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { DpDocenteService } from 'src/app/services/dp-docente.service';
import { ArchivosService } from 'src/app/services/archivos.service';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.scss', '../../../app.component.css'],
})
export class DatosPersonalesComponent implements OnInit {
  @Input() token_data: any;

  private regex_num = /^([0-9])*$/;
  private regex_institucional = /([a-z0-9]{3,})+\@+(profesor\.|)+(uaemex\.mx)/;
  private regex_personal = /([\w\.]+)@([\w\.]+)\.(\w+)/;

  public edicion = false;
  public direccion: any;
  public imgSrc: any;
  public rfcFilename: any = "-";
  public curpFilename: any = "-";

  public URL_IMG = 'http://localhost:3000/api/imagen/';
  public URL_DOC = 'http://localhost:3000/api/documento/get-document/';

  dpForm = this.formBuilder.group({
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
    cp: ['', [Validators.required, Validators.minLength(5), Validators.pattern(this.regex_num)]],
    correo_personal: ['', [Validators.required, Validators.pattern(this.regex_personal)]],
    correo_institucional: ['', [Validators.pattern(this.regex_institucional)]],
    telefono: ['', [Validators.required, Validators.minLength(10), Validators.pattern(this.regex_num)]],
    rfc: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(13)]],
    doc_rfc: ['', [Validators.required]],
    curp: ['', [Validators.required, Validators.minLength(18), Validators.maxLength(18)]],
    doc_curp: ['', [Validators.required]],
    no_empleado: ['', [Validators.minLength(7), Validators.pattern(this.regex_num)]],
    ldg: [false],
    ldi: [false],
    arq: [false],
    apou: [false],
  });

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private dpDocenteService: DpDocenteService,
    private archivosService: ArchivosService,
  ) {
    // this.token_data = this.loginService.decodeToken();
    // this.token_data.id = this.loginService.decodeToken()._id;
    // this.cleanToken();
  }

  ngOnInit(): void {
    this.token_data = this.loginService.decodeToken();
    this.token_data._id = this.loginService.decodeToken()._id;
    this.direccion = this.token_data.direccion.split(", ");
    this.cleanToken();
    // console.log(this.token_data);
    // this.getDocente();
  }

  getDocente() {
    this.dpDocenteService.getDocente(this.token_data.id).subscribe(
      res => {
        console.log(res)
        this.token_data = res.docente;
        this.token_data.id = res.docente._id;
        console.log(this.token_data);
      },
      err => console.log(err)
    );
  }

  cleanToken() {
    if (this.token_data.nombre == "No ingresado") {
      this.token_data.nombre = "";
    }

    if (this.token_data.apellido_p == "No ingresado") {
      this.token_data.apellido_p = "";
    }

    if (this.token_data.apellido_m == "No ingresado") {
      this.token_data.apellido_m = "";
    }

    if (this.token_data.direccion == "No ingresado") {
      this.token_data.direccion = "";
    }

    if (this.token_data.correo_personal == "no_inicializado@mail.com") {
      this.token_data.correo_personal = "";
    }

    if (this.token_data.correo_institucional == "no_inicializado@uaemex.com") {
      this.token_data.correo_institucional = "";
    }

    if (this.token_data.telefono == "0000000000") {
      this.token_data.telefono = "";
    }

    if (this.token_data.rfc == "ABCD123456789"){
      this.token_data.rfc = "";
    }

    if (this.token_data.curp == "ABCD123456EFGHIJK0"){
      this.token_data.curp = "";
    }
  }

  enviarDatos() {
    this.uploadImage();

    if (this.dpForm.get('doc_rfc')?.value) {
      this.uploadDocument('rfc', 'doc_rfc');
    }

    if (this.dpForm.get('doc_curp')?.value) {
      this.uploadDocument('curp', 'doc_curp');
    }

    let docente = {
      _id: this.token_data.id,
      nombre: this.dpForm.get('nombre')?.value,
      apellido_p: this.dpForm.get('apellido_p')?.value,
      apellido_m: this.dpForm.get('apellido_m')?.value,
      direccion: this.getDireccion(),
      correo_personal: this.dpForm.get('correo_personal')?.value,
      correo_institucional: this.dpForm.get('correo_institucional')?.value,
      telefono: this.dpForm.get('telefono')?.value,
      rfc: this.dpForm.get('rfc')?.value,
      curp: this.dpForm.get('curp')?.value,
      rol: 'USER_ROLE',
      no_empleado: this.dpForm.get('no_empleado')?.value,
      ldg: this.dpForm.get('ldg')?.value,
      ldi: this.dpForm.get('ldi')?.value,
      arq: this.dpForm.get('arq')?.value,
      apou: this.dpForm.get('apou')?.value,
    }

    this.dpDocenteService.updateDocente(docente).subscribe(
      res => {
        this.loginService.setToken(res.token);
        this.token_data = this.loginService.decodeToken();
        this.edicion = false;
        // console.log(this.token_data);
      }, err => {
        console.log(err);
      }
    );

    // this.refreshService.sendUpdate(this.token_data);
    this.getDocente();
    // this.imgSrc = undefined;
    // console.log(this.token_data);
  }

  setData() {
    if (this.token_data.nombre != "No ingresado") {
      this.dpForm.get('nombre')?.setValue(this.token_data.nombre);
    }

    if (this.token_data.apellido_p != "No ingresado") {
      this.dpForm.get('apellido_p')?.setValue(this.token_data.apellido_p);
    }

    if (this.token_data.apellido_m != "No ingresado") {
      this.dpForm.get('apellido_m')?.setValue(this.token_data.apellido_m);
    }

    if (this.token_data.correo_personal != "no_inicializado@mail.com") {
      this.dpForm.get('correo_personal')?.setValue(this.token_data.correo_personal);
    }

    if (this.token_data.correo_institucional != "no_inicializado@uaemex.com") {
      this.dpForm.get('correo_institucional')?.setValue(this.token_data.correo_institucional);
    }

    if (this.token_data.telefono != "0000000000") {
      this.dpForm.get('telefono')?.setValue(this.token_data.telefono);
    }

    if (this.token_data.no_empleado != "0000000") {
      this.dpForm.get('no_empleado')?.setValue(this.token_data.no_empleado);
    }

    this.dpForm.get('img')?.setValue(this.token_data.img);
    this.dpForm.get('rfc')?.setValue(this.token_data.rfc);
    this.dpForm.get('curp')?.setValue(this.token_data.curp);
    this.dpForm.get('doc_rfc')?.setValue(this.token_data.doc_rfc);
    this.dpForm.get('doc_curp')?.setValue(this.token_data.doc_curp);
    this.dpForm.get('ldg')?.setValue(this.token_data.ldg);
    this.dpForm.get('ldi')?.setValue(this.token_data.ldi);
    this.dpForm.get('arq')?.setValue(this.token_data.arq);
    this.dpForm.get('apou')?.setValue(this.token_data.apou);

    this.rfcFilename = this.token_data.doc_rfc;
    this.curpFilename = this.token_data.doc_curp;
  }

  getDireccion() {
    if (this.dpForm.get('no_ext')?.value == "" || this.dpForm.get('no_ext')?.value == null) {
      this.dpForm.get('no_ext')?.setValue("SN");
    }

    if (this.dpForm.get('no_int')?.value == "" || this.dpForm.get('no_int')?.value == null) {
      this.dpForm.get('no_int')?.setValue("SN");
    }

    return this.dpForm.get('calle')?.value + ", " + this.dpForm.get('no_ext')?.value + ", "
      + this.dpForm.get('no_int')?.value + ", " + this.dpForm.get('colonia')?.value + ", "
      + this.dpForm.get('municipio')?.value + ", " + this.dpForm.get('estado')?.value + ", "
      + this.dpForm.get('cp')?.value;
  }

  setDomicilio() {
    this.dpForm.get('calle')?.setValue(this.direccion[0]);
    this.dpForm.get('no_ext')?.setValue(this.direccion[1]);
    this.dpForm.get('no_int')?.setValue(this.direccion[2]);
    this.dpForm.get('colonia')?.setValue(this.direccion[3]);
    this.dpForm.get('municipio')?.setValue(this.direccion[4]);
    this.dpForm.get('estado')?.setValue(this.direccion[5]);
    this.dpForm.get('cp')?.setValue(this.direccion[6]);
  }

  onImageSelect(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.imgSrc = reader.result;

      reader.readAsDataURL(file);
      this.dpForm.get('img')?.setValue(file);
    }
  }

  onRFCSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.dpForm.get('doc_rfc')?.setValue(file);
      this.rfcFilename = file.name;
      // console.log(this.dpForm.get('doc_rfc')?.value);
    }
  }

  onCURPSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.dpForm.get('doc_curp')?.setValue(file);
      this.curpFilename = file.name;
    }
  }

  uploadImage() {
    const formData = new FormData();

    formData.append('img', this.dpForm.get('img')?.value!);
    this.archivosService.setImage(this.token_data.id, formData).subscribe(
      (res: any) => {
        this.token_data.img = res.img;
        this.dpForm.get('img')?.setValue(res.img);
      },
      (err: any) => {
        console.log(err);
      });
  }

  uploadDocument(tipo: string, campo: string) {
    const formData = new FormData();

    formData.append(tipo, this.dpForm.get(campo)?.value!);
    this.archivosService.setDoc(tipo, this.token_data.id, formData).subscribe(
      (res: any) => {
        if (tipo == 'rfc') this.token_data.doc_rfc = res.doc;
        if (tipo == 'curp') this.token_data.doc_curp = res.doc;
        this.dpForm.get(campo)?.setValue(res.doc);
      },
      (err: any) => {
        console.log(err);
      });
  }

  getImage() {
    return this.URL_IMG + 'get-image/' + this.token_data.img;
  }

  cambiar_modo(modo: number) {
    switch (modo) {
      case 1:
        this.token_data = this.loginService.decodeToken();
        this.token_data._id = this.loginService.decodeToken()._id;
        this.direccion = this.token_data.direccion.split(", ");
        this.cleanToken();
        this.edicion = false;
        break;
      case 2:
        this.edicion = true;
        // console.log(this.token_data);
        this.setData();
        this.setDomicilio();
        break;
    }
  }

  public listaEstados = [ 
    "Aguascalientes",
    "Baja California",
    "Baja California Sur",
    "Campeche",
    "Chiapas",
    "Chihuahua",
    "Cuidad de México",
    "Coahuila",
    "Colima",
    "Durango",
    "Guanajuato",
    "Guerrero",
    "Hidalgo",
    "Jalisco",
    "México",
    "Michoacán",
    "Morelos",
    "Nayarit",
    "Nuevo León",
    "Oaxaca",
    "Puebla",
    "Querétaro",
    "Quintana Roo",
    "San Luis Potosí",
    "Sinaloa",
    "Sonora",
    "Tabasco",
    "Tamaulipas",
    "Tlaxcala",
    "Veracruz",
    "Yucatán",
    "Zacatecas"];

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

}
