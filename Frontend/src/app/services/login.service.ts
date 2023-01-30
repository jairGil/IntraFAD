import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ng2-cookies';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private URL = 'http://localhost:3001/api/docente';
  private token = undefined;
  
  private jwtHelper = new JwtHelperService();

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
    ) { }

  login(docente: any): any {
    return this.http.post<any>(this.URL + '/login', docente);
  }

  loginNoInstitutional(docente: any): any {
    return this.http.post<any>(this.URL + '/login-noi', docente);
  }

  setToken(token: any) { 
    // this.token = token;
    this.cookieService.set('token', token); 
  }

  loggedIn(): Boolean {
    // return !!this.token;
    return !!this.cookieService.get('token');
  }

  getToken(): any { 
    // return this.token;
    return this.cookieService.get('token');
  }

  decodeToken(): any { 
    // return this.jwtHelper.decodeToken(this.token);
    return this.jwtHelper.decodeToken(this.getToken());
  }
  
  logout(): any {
    // this.token = undefined;
    this.cookieService.delete('token');
  }
}
