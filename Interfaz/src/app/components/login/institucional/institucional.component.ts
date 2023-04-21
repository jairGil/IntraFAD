import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/login.service'
import { DpDocenteService } from 'src/app/services/dp-docente.service';

@Component({
  selector: 'login-institucional',
  templateUrl: './institucional.component.html',
  styleUrls: ['./institucional.component.scss', '../../../app.component.css']
})
export class LoginInstitucionalComponent {

  regex_mail = /([a-z0-9]{3,})+\@+(profesor\.|)+(uaemex\.mx)/;
  error = {
    msg: '',
    value: true,
    code: 0
  };

  loginForm = this.formBuilder.group({
    correo_institucional: ['', {
      validators: [Validators.required, Validators.pattern(this.regex_mail)]
    }],
    contrasena: ['', [Validators.required]],
    confirmaContrasena: null
  });

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private dpDocenteService: DpDocenteService
  ) { }

  login() {
    if(this.error.code == 300){
      if(this.loginForm.value.contrasena === this.loginForm.value.confirmaContrasena){
        //Actualizar contraseña del docente
        const obj = {
          correo_institucional: this.loginForm.value.correo_institucional,
          contrasena: this.loginForm.value.contrasena
        }

        this.dpDocenteService.updatePwd(obj).subscribe(
          (res: any) =>{
            this.loginService.login(this.loginForm.value)
            .subscribe(
              (res: any) => {
                this.loginService.setToken(res.token);
                this.router.navigate(['/home']);
              },
              (err: any) => {
                this.error = err.error;
              }
            );
          },
          (err: any) => {
            this.error = err.error;
          }
        );
      }else { 
        console.log("Las contraseñas no coinciden")
        this.error.value = false;
        this.error.code = 300;
        this.error.msg = "Las contraseñas no coinciden";
        
      }
    }else
      this.loginService.login(this.loginForm.value)
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
