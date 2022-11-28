import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public pagina = 0;

  constructor() { }

  cambia_pagina(pag: number) {
    this.pagina = pag;
  }

}
