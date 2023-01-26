import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private URL = 'http://localhost:3001/api/docente';
  private token = undefined;
  
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  login(docente: any): any {
    return this.http.post<any>(this.URL + '/login', docente);
  }

  loginNoInstitutional(docente: any): any {
    return this.http.post<any>(this.URL + '/login-noi', docente);
  }

  setToken(token: any) { this.token = token; }

  loggedIn(): Boolean { return !!this.token; }

  getToken(): any { return this.token; }

  decodeToken(): any { return this.jwtHelper.decodeToken(this.token); }
}
