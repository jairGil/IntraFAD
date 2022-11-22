import { Component } from '@angular/core';

import { Docente } from '../../models/docente';
import { DpDocenteService } from '../../services/dp-docente.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  public paso: number = 1;
  public docente!: Docente;

  constructor(
    private dpDocenteService: DpDocenteService
  ) {
    this.docente = new Docente();
  }

  cambia_pagina() {
    this.paso++;
  }

  recibirDatos($event: any) {
    let datos = $event;

    switch (this.paso) {
      case 1:
        this.docente.correo_institucional = datos.correo_institucional;
        this.docente.contrasena = datos.contrasena;
        this.docente.confirma_contrasena = datos.confirma_contrasena;
        this.docente.rol = "USER_ROLE";
        break;
      case 2:
        this.docente.img = datos.img;
        this.docente.nombre = datos.nombre;
        this.docente.apellido_p = datos.apellido_p;
        this.docente.apellido_m = datos.apellido_m;
        this.docente.no_empleado = datos.no_empleado;
        this.docente.curp = datos.curp;
        this.docente.rfc = datos.rfc;
        this.docente.doc_curp = datos.doc_curp;
        this.docente.doc_rfc = datos.doc_rfc;
        break;
      case 3:
        this.docente.correo_personal = datos.correo_personal;
        this.docente.telefono = datos.telefono;
        this.docente.direccion = datos.direccion;
        break;
      case 4:
        if (datos.enviar) {
          this.crear_cuenta();
        }
        break;
    }
    this.paso = datos.siguiente;
  }

  crear_cuenta() {
    this.dpDocenteService.register(this.docente)
      .subscribe(
        (res: any) => {
          this.paso = 5;
          console.log(res);
        },
        (err: any) => {
          console.log(err);
        }
      )
  }
}
