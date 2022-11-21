import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.scss']
})
export class DatosPersonalesComponent implements OnInit {

  public img!: string;
  public nombre!: string;
  public apellido_p!: string;
  public apellido_m!: string;
  public no_empleado!: string;
  public rfc!: string;
  public doc_rfc!: string;
  public curp!: string;
  public doc_curp!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
