import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.scss', '../../../app.component.css']
})
export class DatosPersonalesComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<object>();
  private jwtHelper = new JwtHelperService();
  public token_data: any;

  constructor(
    private loginService: LoginService
    ) { }

  ngOnInit(): void {
    this.decodeToken();
  }
  
  decodeToken() {
    this.token_data = this.jwtHelper.decodeToken(this.loginService.getToken());
  }

  modo_edicion() {
    this.messageEvent.emit({ edicion: true });
  }

}
