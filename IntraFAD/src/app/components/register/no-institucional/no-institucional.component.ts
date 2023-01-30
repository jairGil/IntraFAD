import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DpDocenteService } from 'src/app/services/dp-docente.service';

@Component({
  selector: 'register-no-institucional',
  templateUrl: './no-institucional.component.html',
  styleUrls: ['./no-institucional.component.scss', '../../../app.component.css']
})
export class RegisterNoInstitucionalComponent {

  @Output() messageEvent = new EventEmitter<object>();
  regex_contrasena = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  regex_mail = /([\w\.]+)@([\w\.]+)\.(\w+)/;
  error = {
    msg: '',
    value: true
  };

  registerForm = this.formBuilder.group({
    correo_personal: ['', {
      validators: [Validators.required, Validators.pattern(this.regex_mail)]
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
    this.dpDocenteService.registerNoInstitutional(this.registerForm.value)
      .subscribe(
        (res: any) => {
          this.messageEvent.emit({ res: res });
        },
        (err: any) => {
          this.error = err.error;
        });
  }

  get correo_personal() { return this.registerForm.get('correo_personal'); }
  get contrasena() { return this.registerForm.get('contrasena'); }
  get confirma_contrasena() { return this.registerForm.get('confirma_contrasena'); }
}
