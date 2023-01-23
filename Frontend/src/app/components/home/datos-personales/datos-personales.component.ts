import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { ArchivosService } from 'src/app/services/archivos.service';
import { CommonService } from 'src/app/services/common.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.scss', '../../../app.component.css']
})
export class DatosPersonalesComponent implements OnInit, OnDestroy {
  @Output() messageEvent = new EventEmitter<object>();
  @Input() token_data: any;

  public URL_IMG = 'http://localhost:3000/api/imagen/';
  messageReceived: any;
  private refreshSub: Subscription;

  constructor(
    private archivosService: ArchivosService,
    private refreshService: CommonService
  ) {
    this.refreshSub = this.refreshService.getUpdate().subscribe
    (datos => {
      this.messageReceived = datos;
      console.log("datos recibidos");
      console.log(this.messageReceived);
    });
  }

  ngOnInit(): void {
    this.cleanToken();
    console.log("aqui:");
    console.log(this.messageReceived);
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
  }

  modo_edicion() {
    this.messageEvent.emit({ edicion: true });
  }

  ngOnDestroy() {
    this.refreshSub.unsubscribe();
}
}
