import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', '../../app.component.css']
})
export class LoginComponent {

  private regex_institucional = /([a-z0-9]{3,})+\@+(profesor\.|)+(uaemex\.mx)/;
  private regex_mail = /([\w\.]+)@([\w\.]+)\.(\w+)/;
  
  public loginForm: FormGroup;
  public institucional = true;
  public error = {
    msg: '',
    value: true
  };

  
  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      correo_institucional: ['', {
        validators: [Validators.required, Validators.pattern(this.regex_institucional)]
      }],
      correo_personal: ['', {
        validators: [Validators.required, Validators.pattern(this.regex_mail)]
      }],
      contrasena: ['', [Validators.required]],
    });
  }

  /**
   * Cambia el tipo de cuenta entre institucional y personal
   * @returns void
   * @memberof LoginComponent
   * @since 1.0.0
   * @version 1.0.0 
   */
  public cambiaTipoCuenta(): void {
    this.institucional = !this.institucional;
  }

  
  /**
   * Valida el formulario de inicio de sesión
   * @returns boolean
   * @memberof LoginComponent
   * @since 1.0.0
   * @version 1.0.0
  */
  public formValid(): boolean {
    if (this.institucional) {
      return this.loginForm.get('correo_institucional')!.valid && this.loginForm.get('contrasena')!.valid;
    }

    return this.loginForm.get('correo_personal')!.valid && this.loginForm.get('contrasena')!.valid;
  }

  /**
   * Inicia sesión dependiendo el tipo de cuenta
   * @returns void
   * @memberof LoginComponent
   * @since 1.0.0
   * @version 1.0.0
  */
  public login(): void {
    if (this.institucional) {
      this.loginService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          if(res.value) {
            this.loginService.setToken(res.token);
            this.router.navigate(['/home']);
          } else {
            this.error = res;
          }
        },
        error: (err: any) => {
          this.error = err.error;
        }
      });
    } else {
      this.loginService.loginNoInstitutional(this.loginForm.value).subscribe({
        next: (res: any) => {
          if(res.value) {
            this.loginService.setToken(res.token);
            this.router.navigate(['/home']);
          } else {
            this.error = res;
          }
        },
        error: (err: any) => {
          this.error = err.error;
        }
      });
    }
  }

  
  get correo_institucional() { return this.loginForm.get('correo_institucional'); }
  get correo_personal() { return this.loginForm.get('correo_personal'); }
  get contrasena() { return this.loginForm.get('contrasena'); }
}
