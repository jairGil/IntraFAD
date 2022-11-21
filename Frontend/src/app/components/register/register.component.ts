import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { Docente } from '../../models/docente';
import { CuentaComponent } from './cuenta/cuenta.component';
import { DatosPersonalesComponent } from './datos-personales/datos-personales.component';
import { DatosContactoComponent } from './datos-contacto/datos-contacto.component';

import { DpDocenteService } from '../../services/dp-docente.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements AfterViewInit {
  @ViewChild(CuentaComponent) cuenta!: CuentaComponent;
  @ViewChild(DatosPersonalesComponent) dp_docente!: DatosPersonalesComponent;
  @ViewChild(DatosContactoComponent) dc_docente!: DatosContactoComponent;

  public paso: number = 1;
  private docente!: Docente;

  constructor(
    private dpDocenteService: DpDocenteService,
    private router: Router
  ) { }

  ngAfterViewInit(): void {
    this.set_docente();
  }

  set_docente() {
    this.docente = new Docente(
      "algo.jpg",
      this.dp_docente.nombre,
      this.dp_docente.apellido_p,
      this.dp_docente.apellido_m,
      this.dc_docente.getDireccion(),
      this.dc_docente.telefono,
      this.dc_docente.correo_personal,
      this.cuenta.correo_institucional,
      this.cuenta.contrasena,
      this.cuenta.confirma_contrasena,
      "USER_ROLE",
      this.dp_docente.no_empleado,
      this.dp_docente.rfc,
      "asf.pdf",
      this.dp_docente.curp,
      "sadf.pdf"
    );
  }

  cambia_pagina() {
    switch (this.paso) {
      case 1:
        this.docente.correo_institucional = this.cuenta.correo_institucional;
        this.docente.contrasena = this.cuenta.contrasena;
        this.docente.confirma_contrasena = this.cuenta.confirma_contrasena;
        break;
      case 2:
        this.docente.nombre = this.dp_docente.nombre;
        this.docente.apellido_p = this.dp_docente.apellido_p;
        this.docente.apellido_m = this.dp_docente.apellido_m;
        this.docente.curp = this.dp_docente.curp;
        break;
    }
    this.paso++;
  }

  crear_cuenta() {
    this.set_docente();
    this.dpDocenteService.register(this.docente)
      .subscribe(
        (res: any) => {
          console.log(res);
        },
        (err: any) => {
          console.log(err);
        }
      )
  }
}
