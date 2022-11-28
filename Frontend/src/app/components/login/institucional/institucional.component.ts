import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/login.service'

@Component({
  selector: 'login-institucional',
  templateUrl: './institucional.component.html',
  styleUrls: ['./institucional.component.scss', '../../../app.component.css']
})
export class LoginInstitucionalComponent {

  regex_mail = /([a-z0-9]{3,})+\@+(profesor\.|)+(uaemex\.mx)/;
  error = {
    msg: '',
    value: true
  };

  loginForm = this.formBuilder.group({
    correo_institucional: ['', {
      validators: [Validators.required, Validators.pattern(this.regex_mail)]
    }],
    contrasena: ['', [Validators.required]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) { }

  login() {
    this.loginService.loginNoInstitutional(this.loginForm.value)
      .subscribe(
        (res: any) => {
          this.loginService.setToken(res.token);
          this.router.navigate(['/home']);
        },
        (err: any) => {
          this.error = err.error;
        }
      );
  }

  get correo_institucional() { return this.loginForm.get('correo_institucional'); }
  get contrasena() { return this.loginForm.get('contrasena'); }

}
