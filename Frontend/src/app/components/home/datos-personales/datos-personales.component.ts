import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ArchivosService } from 'src/app/services/archivos.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.scss', '../../../app.component.css']
})
export class DatosPersonalesComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<object>();
  @Input() token_data: any;

  public URL_IMG = 'http://localhost:3000/api/imagen/';

  constructor(
    private archivosService: ArchivosService
  ) { }

  ngOnInit(): void {
    this.cleanToken();
    this.cargar_imagen();
  }

  cleanToken() {
    if (this.token_data.nombre == "No ingresado") {
      this.token_data.nombre = "";
    }

    if (this.token_data.apellido_p == "No ingresado") {
      this.token_data.apellido_p = "";
    }

    if (this.token_data.apellido_m == "No ingresado") {
      this.token_data.apellido_m = "";
    }

    if (this.token_data.direccion == "No ingresado") {
      this.token_data.direccion = "";
    }

    if (this.token_data.correo_personal == "no_inicializado@mail.com") {
      this.token_data.correo_personal = "";
    }

    if (this.token_data.correo_institucional == "no_inicializado@uaemex.com") {
      this.token_data.correo_institucional = "";
    }

    if (this.token_data.telefono == "0000000000") {
      this.token_data.telefono = "";
    }

    if (this.token_data.img == "sin_foto.jpg") {
      this.token_data.img = "";
    }
  }

  modo_edicion() {
    this.messageEvent.emit({ edicion: true });
  }

  cargar_imagen() {
    this.archivosService.getImage(this.token_data.img).subscribe(
      (res: any) => {
        console.log(res);
        this.token_data.img = res;
      },
      (err: any) => {
        console.log(err);
      });
  }

}
