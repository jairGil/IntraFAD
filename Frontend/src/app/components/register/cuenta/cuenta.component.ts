import { Component } from '@angular/core';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.scss']
})
export class CuentaComponent {

  public correo_institucional!: string;
  public contrasena!: string;
  public confirma_contrasena!: string;

  constructor() { }

}
