import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.scss', '../register.component.css']
})
export class DatosPersonalesComponent {

  public datos = {
    img: '',
    nombre: '',
    apellido_p: '',
    apellido_m: '',
    no_empleado: '',
    rfc: '',
    doc_rfc: '',
    curp: '',
    doc_curp:'',
    siguiente: 3
  }
  
  @Output() messageEvent = new EventEmitter<object>();

  constructor() { }

  enviarDatos() {
    this.messageEvent.emit(this.datos);
  }

  regresar() {
    this.datos.siguiente = 1;
  }
}
