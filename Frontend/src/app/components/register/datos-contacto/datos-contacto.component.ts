import { Component } from '@angular/core';

@Component({
  selector: 'app-datos-contacto',
  templateUrl: './datos-contacto.component.html',
  styleUrls: ['./datos-contacto.component.scss']
})
export class DatosContactoComponent {

  public correo_personal!: string;
  public telefono!: string;
  public direccion!: string;
  public ciudad!:string;
  public estado!: string;
  public cp!: string;

  constructor() { }

  getDireccion() {
    return this.direccion + ", " + this.ciudad + ", " + this.estado + ", " + this.cp;
  }

}
