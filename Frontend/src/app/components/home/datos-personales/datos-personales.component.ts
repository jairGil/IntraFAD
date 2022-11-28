import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { JwtHelperService } from "@auth0/angular-jwt";
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.scss', '../../../app.component.css']
})
export class DatosPersonalesComponent {

  private regex_num = /^([0-9])*$/;
  private regex_institucional = /([a-z0-9]{3,})+\@+(profesor\.|)+(uaemex\.mx)/;
  private regex_personal = /([\w\.]+)@([\w\.]+)\.(\w+)/;
  private jwtHelper = new JwtHelperService();
  public token_data: any;

  dpForm = this.formBuilder.group({
    img: [''],
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    apellido_p: ['', [Validators.required, Validators.minLength(3)]],
    apellido_m: ['', [Validators.required, Validators.minLength(3)]],
    calle: ['', [Validators.required, Validators.minLength(3)]],
    no_ext: ['', Validators.pattern(this.regex_num)],
    no_int: ['',  Validators.pattern(this.regex_num)],
    colonia: ['', [Validators.required, Validators.minLength(3)]],
    estado: ['', [Validators.required, Validators.minLength(3)]],
    municipio: ['', [Validators.required, Validators.minLength(3)]],
    cp: ['', [Validators.required, Validators.minLength(5), Validators.pattern(this.regex_num)]],
    correo_personal: ['', [Validators.required, Validators.pattern(this.regex_personal)]],
    correo_institucional: ['', [Validators.required, Validators.pattern(this.regex_institucional)]],
    telefono: ['', [Validators.required, Validators.minLength(10), Validators.pattern(this.regex_num)]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService
  ) {
    this.decodeToken();
  }

  enviarDatos() {
  }

  decodeToken() {
    this.token_data = this.jwtHelper.decodeToken(this.loginService.getToken());
    console.log(this.token_data);
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
}
