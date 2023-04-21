import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../../app.component.css']
})
export class LoginComponent {

  public institucional = true;
  
  constructor() { }

  cambiaTipoCuenta() {
    this.institucional = !this.institucional;
  }

}
