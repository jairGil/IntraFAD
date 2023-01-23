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

  daForm = this.formBuilder.group({
    grado_s: ['', Validators.required],
    grado_t: ['', Validators.required],
    institucion: ['', Validators.required],
    fecha: ['', Validators.required],
    comprobante_t: ['', Validators.required],
    cedula_t: ['', Validators.required]
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



