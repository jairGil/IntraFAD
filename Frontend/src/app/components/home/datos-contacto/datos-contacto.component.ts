import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-datos-contacto',
  templateUrl: './datos-contacto.component.html',
  styleUrls: ['./datos-contacto.component.scss',]
})
export class DatosContactoComponent {

  public datos = {
    correo_personal: '',
    telefono: '',
    direccion: '',
    siguiente: 4
  }
  
  public direccion!: string;
  public ciudad!:string;
  public estado!: string;
  public cp!: string;
  
  @Output() messageEvent = new EventEmitter<object>();

  constructor() { }

  getDireccion() {
    return this.direccion + ", " + this.ciudad + ", " + this.estado + ", " + this.cp;
  }

  enviarDatos() {
    this.datos.direccion = this.getDireccion();
    this.messageEvent.emit(this.datos);
  }

  regresar() {
    this.datos.siguiente = 2;
  }
}
