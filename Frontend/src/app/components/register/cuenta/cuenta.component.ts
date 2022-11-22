import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cuenta',
  templateUrl: './cuenta.component.html',
  styleUrls: ['./cuenta.component.scss', '../register.component.css']
})
export class CuentaComponent {

  public datos = {
    correo_institucional: '',
    contrasena: '',
    confirma_contrasena: '',
    siguiente: 2
  };

  @Output() messageEvent = new EventEmitter<object>();

  constructor(private router: Router) { }

  enviarDatos() {
    this.messageEvent.emit(this.datos);
  }

  regresar() {
    this.router.navigate(['/login']);
  }
}
