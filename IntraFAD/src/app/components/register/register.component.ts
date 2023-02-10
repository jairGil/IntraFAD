import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DpDocenteService } from 'src/app/services/dp-docente.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../../app.component.css']
})
export class RegisterComponent {

  private regex_contrasena = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  private regex_mail_uaemex = /([a-z0-9]{3,})+\@+(profesor\.|)+(uaemex\.mx)/;
  private regex_mail = /([\w\.]+)@([\w\.]+)\.(\w+)/;

  public institucional = true;
  public submitted = false;
  public error = {
    msg: '',
    value: true
  };

  registerForm = this.formBuilder.group({
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

  constructor(
    private formBuilder: FormBuilder,
    private dpDocenteService: DpDocenteService,
    private router: Router,
  ) { }

  cambiaTipoCuenta() {
    this.institucional = !this.institucional;
  }

  submit() {
    this.submitted = true;
    
    if (this.registerForm.value.contrasena === this.registerForm.value.confirma_contrasena) {
      if (this.institucional) {
        this.dpDocenteService.register(this.registerForm.value).subscribe({
          next: res => {
            if (res.value) {
              this.router.navigate(['/cuenta-creada']);
            } else {
              this.error = res;
            }
          },
          error: err => {
            console.log(err);
          }
        });
      } else {
        this.dpDocenteService.registerNoInstitutional(this.registerForm.value).subscribe({
        next: (res: any) => {
          if (res.value) {
            this.router.navigate(['/cuenta-creada']);
          } else {
            this.error = res;
          }
        },
        error: (err: any) => {
          console.log(err);
        }
      });
      }
    }
  }

  validForm(): boolean {
    let valid = false;
    if (this.institucional) {
      valid = this.correo_institucional!.valid;
    } else {
      valid = this.correo_personal!.valid;
    }

    return valid && this.contrasena!.valid && this.confirma_contrasena!.valid && this.aviso_privacidad!.valid
  }

  get correo_institucional() { return this.registerForm.get('correo_institucional'); }
  get correo_personal() { return this.registerForm.get('correo_personal'); }
  get contrasena() { return this.registerForm.get('contrasena'); }
  get confirma_contrasena() { return this.registerForm.get('confirma_contrasena'); }
  get aviso_privacidad() { return this.registerForm.get('aviso_privacidad'); }

}
