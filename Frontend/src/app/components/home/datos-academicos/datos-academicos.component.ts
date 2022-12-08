import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-datos-academicos',
  templateUrl: './datos-academicos.component.html',
  styleUrls: ['../../../app.component.css', './datos-academicos.component.scss']
})
export class DatosAcademicosComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<object>();

  private jwtHelper = new JwtHelperService();
  public token_data: any;
  public modo_agregar = false;
  dpForm = this.formBuilder.group({

  });

  constructor(
    private loginService: LoginService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.decodeToken();
    this.cleanToken();
    this.modo_agregar = false;
  }

  decodeToken() {
    this.token_data = this.jwtHelper.decodeToken(this.loginService.getToken());
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

    if (this.token_data.img == "sin_foto.jpg") {
      this.token_data.img = "";
    }
  }

  cambiarModo(modo: number) {
    switch (modo) {
      case 1:
        console.log("agregar");
        this.modo_agregar = true;
        break;
      case 2:
        console.log("cancelar");
        this.modo_agregar = false;
        break;
    }
  }

  enviarDatos(){

  }

  change() {
    console.log("go next");
  }
}



