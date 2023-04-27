import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-data-sheet',
  templateUrl: './data-sheet.component.html',
  styleUrls: ['./data-sheet.component.scss', '../../../app.component.scss']
})
export class DataSheetComponent {
  public pagina = 0;

  @ViewChild("btnAcad") btnDA: ElementRef | undefined;
  @ViewChild("btnCert") btnCertificaciones: ElementRef | undefined;
  @ViewChild("btnCour") btnCursos: ElementRef | undefined;
  @ViewChild("btnLang") btnIdiomas: ElementRef | undefined;

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
