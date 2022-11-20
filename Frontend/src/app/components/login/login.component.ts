import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { LoginService } from '../../services/login.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  email = new FormControl('', [Validators.required, Validators.email]);

  docente = {
    correo_institucional: '',
    contrasena: ''
  }

  constructor(private loginService: LoginService) { }

  login() {
    this.loginService.login(this.docente)
      .subscribe(
        (res: any) => {
          console.log(res);
        },
        (err: any) => console.log(err)
      )
  }
}