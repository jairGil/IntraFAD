import { Component, ElementRef, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', '../../app.component.css']
})
export class HomeComponent {

  @ViewChild("btnDP") btnDP: ElementRef | undefined;
  @ViewChild("btnDA") btnDA: ElementRef | undefined;

  public pagina = 0;
  public editar = false;
  public token_data: any;

  constructor(
    private renderer: Renderer2,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.token_data = this.loginService.decodeToken();
    console.log(this.token_data);
  }

  cambia_pagina(pag: number) {
    switch (pag) {
      case 0:
        this.editar = false;
        this.renderer.addClass(this.btnDP?.nativeElement, "btn-outline-success");
        this.renderer.removeClass(this.btnDA?.nativeElement, "btn-outline-success");
        break;
      case 1:
        this.editar = false;
        this.renderer.removeClass(this.btnDP?.nativeElement, "btn-outline-success");
        this.renderer.addClass(this.btnDA?.nativeElement, "btn-outline-success");
        break;
    }
    this.pagina = pag;
  }
}
