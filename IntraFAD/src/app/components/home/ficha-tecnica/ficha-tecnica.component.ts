import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-ficha-tecnica',
  templateUrl: './ficha-tecnica.component.html',
  styleUrls: ['./ficha-tecnica.component.scss', '../home.component.scss']
})
export class FichaTecnicaComponent implements OnInit {
  @Input() token_data: any;
  public pagina = 0;

  @ViewChild("btnDA") btnDA: ElementRef | undefined;
  @ViewChild("btnCertificaciones") btnCertificaciones: ElementRef | undefined;
  @ViewChild("btnCursos") btnCursos: ElementRef | undefined;
  @ViewChild("btnIdiomas") btnIdiomas: ElementRef | undefined;

  constructor(
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
  }

  cambia_pagina(pag: number) {
    this.removeAllClasses();
    switch (pag) {
      case 0:
        this.renderer.addClass(this.btnDA?.nativeElement, "btn-outline-success");
        break;
      case 1:
        this.renderer.addClass(this.btnCertificaciones?.nativeElement, "btn-outline-success");
        break;
      case 2:
        this.renderer.addClass(this.btnCursos?.nativeElement, "btn-outline-success");
        break;
      case 3:
        this.renderer.addClass(this.btnIdiomas?.nativeElement, "btn-outline-success");
        break;
    }
    this.pagina = pag;
  }

  removeAllClasses() {
    this.renderer.removeClass(this.btnDA?.nativeElement, "btn-outline-success");
    this.renderer.removeClass(this.btnCertificaciones?.nativeElement, "btn-outline-success");
    this.renderer.removeClass(this.btnCursos?.nativeElement, "btn-outline-success");
    this.renderer.removeClass(this.btnIdiomas?.nativeElement, "btn-outline-success");
  }

}
