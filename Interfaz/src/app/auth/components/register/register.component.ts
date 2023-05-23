import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service'
import { Docente } from '../../models/docente.model';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../../../app.component.scss']
})
export class RegisterComponent {

  private regex_contrasena = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  private regex_mail_uaemex = /([a-z0-9]{3,})+\@+(profesor\.|)+(uaemex\.mx)/;
  private regex_mail = /([\w\.]+)@([\w\.]+)\.(\w+)/;

  public loading: boolean = false;
  public msg: string = 'Creando cuenta...';
  public registerForm: FormGroup;
  public institucional = true;
  public cuentaCreada = false;
  public submitted = false;
  public error = {
    msg: '',
    value: true
  };


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {
    this.registerForm = this.formBuilder.group({
      correo_institucional: ['', {
        validators: [Validators.required, Validators.pattern(this.regex_mail_uaemex)]
      }],
      correo_personal: ['', {
        validators: [Validators.required, Validators.pattern(this.regex_mail)]
      }],
      contrasena: ['', {
        validators: [Validators.required, Validators.minLength(8), Validators.maxLength(64)]
      }],
      confirma_contrasena: ['', Validators.required],
      aviso_privacidad: [false, Validators.requiredTrue]
    });
  }

  /**
   * Cambiar el tipo de cuenta dependiendo el correo
   * @returns void
   * @memberof RegisterComponent
   * @since 1.0.0
   * @version 1.0.1
  */
  public cambiaTipoCuenta(): void {
    this.institucional = !this.institucional;
  }

  /**
   * Registro de usuarios dependiendo su tipo de correo
   * @returns void
   * @memberof RegisterComponent
   * @since 1.0.0
   * @version 1.0.1
  */
  public submit(): void {
    this.loading = true;
    this.submitted = true;

    let docente: Docente = this.registerForm.value;
    
    if (this.registerForm.value.contrasena === this.registerForm.value.confirma_contrasena) {
      if (this.institucional) {
        this.authService.register(docente).subscribe({
          next: (res: any) => {
            console.log(res)
            if (res.value) {
              this.cuentaCreada = true;
              this.showNotification("Cuenta creada correctamente", res.code);
            } else {
              this.error = res;
              this.showNotification(res.msg, res.code);
            }
            this.loading = false;
          },
          error: (err: any) => {
            this.loading = false;
            this.error = err.error;
            this.showNotification(err.error.msg, 500);
          }
        });
      }
    }
  }

  /**
   * Validar que el formulario es correcto dependiendo el tipo de cuenta
   * @returns boolean
   * @memberof RegisterComponent
   * @since 1.0.0
   * @version 1.0.1
   */
  public validForm(): boolean {
    let valid = false;
    if (this.institucional) {
      valid = this.correo_institucional!.valid;
    } else {
      valid = this.correo_personal!.valid;
    }

    return valid && this.contrasena!.valid && this.confirma_contrasena!.valid && this.aviso_privacidad!.valid
  }

  /**
   * Mostrar una notificación
   * @returns void
   * @since 1.1.0
   * @version 1.0.0
  */
  public showNotification(message: string, code: number): void {
    this.notificationService.showNotification(message, code);
  }

  get correo_institucional() { return this.registerForm.get('correo_institucional'); }
  get correo_personal() { return this.registerForm.get('correo_personal'); }
  get contrasena() { return this.registerForm.get('contrasena'); }
  get confirma_contrasena() { return this.registerForm.get('confirma_contrasena'); }
  get aviso_privacidad() { return this.registerForm.get('aviso_privacidad'); }
}
