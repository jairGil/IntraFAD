import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../../app.component.css']
})
export class RegisterComponent {

  public data!: any;
  public institucional = true;

  constructor() { }

  recibirDatos($event: any) {
    this.data = $event.res;
  }

  cambiaTipoCuenta() {
    this.institucional = !this.institucional;
  }

}
