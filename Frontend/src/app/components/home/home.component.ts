import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  @ViewChild("btnDP") btnDP: ElementRef | undefined;
  @ViewChild("btnDA") btnDA: ElementRef | undefined;

  public pagina = 0;

  constructor(private renderer: Renderer2) { }

  cambia_pagina(pag: number) {
    switch (pag) {
      case 0:
        this.renderer.addClass(this.btnDP?.nativeElement, "btn-outline-success");
        this.renderer.removeClass(this.btnDA?.nativeElement, "btn-outline-success");
        break;
      case 1:
        this.renderer.removeClass(this.btnDP?.nativeElement, "btn-outline-success");
        this.renderer.addClass(this.btnDA?.nativeElement, "btn-outline-success");
        break;
    }

    this.pagina = pag;
  }

}
