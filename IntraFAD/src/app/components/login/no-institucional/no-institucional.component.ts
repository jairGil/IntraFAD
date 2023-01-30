import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'login-no-institucional',
  templateUrl: './no-institucional.component.html',
  styleUrls: ['./no-institucional.component.scss', '../../../app.component.css']
})
export class LoginNoInstitucionalComponent {
  
  regex_mail = /([\w\.]+)@([\w\.]+)\.(\w+)/;
  error = {
    msg: '',
    value: true
  };

  loginForm = this.formBuilder.group({
    correo_personal: ['', {
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

  get correo_personal() { return this.loginForm.get('correo_personal'); }
  get contrasena() { return this.loginForm.get('contrasena'); }

}
