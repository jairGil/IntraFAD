import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Docente } from 'src/app/models/docente';

@Component({
  selector: 'app-comprobar-datos',
  templateUrl: './comprobar-datos.component.html',
  styleUrls: ['./comprobar-datos.component.scss', '../register.component.css']
})
export class ComprobarDatosComponent {

  @Input() docente!: Docente;
  @Output() messageEvent = new EventEmitter<any>();

  public datos = {
    siguiente: 4,
    enviar: false
  }

  constructor() { }

  getNombre() {
    return this.docente.nombre + " " + this.docente.apellido_p + " " + this.docente.apellido_m;
  }

  enviarDatos() {
    this.datos.enviar = !this.datos.enviar;
    this.messageEvent.emit(this.datos);
  }

  regresar() {
    this.datos.siguiente = 3;
  }
}
