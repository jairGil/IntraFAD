import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DpDocenteService } from 'src/app/services/dp-docente.service';

@Component({
  selector: 'register-institucional',
  templateUrl: './institucional.component.html',
  styleUrls: ['./institucional.component.scss', '../../../app.component.css']
})
export class RegisterInstitucionalComponent {

  @Output() messageEvent = new EventEmitter<object>();
  regex_contrasena = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  regex_mail_uaemex = /([a-z0-9]{3,})+\@+(profesor\.|)+(uaemex\.mx)/;
  error = {
    msg: '',
    value: true
  };

  registerForm = this.formBuilder.group({
    correo_institucional: ['', {
      validators: [Validators.required, Validators.pattern(this.regex_mail_uaemex)]
    }],
    contrasena: ['', {
      validators: [Validators.required, Validators.pattern(this.regex_contrasena)]
    }],
    confirma_contrasena: ['', Validators.required]
  });

  constructor(
    private formBuilder: FormBuilder,
    private dpDocenteService: DpDocenteService
  ) { }

  submit() {
    this.dpDocenteService.register(this.registerForm.value)
      .subscribe(
        (res: any) => {
          this.messageEvent.emit({ res: res });
        },
        (err: any) => {
          this.error = err.error;
        });
  }

  get correo_institucional() { return this.registerForm.get('correo_institucional'); }
  get contrasena() { return this.registerForm.get('contrasena'); }
  get confirma_contrasena() { return this.registerForm.get('confirma_contrasena'); }
}
