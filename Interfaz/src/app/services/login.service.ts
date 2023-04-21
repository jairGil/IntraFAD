import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private URL = environment.URL_DP;

  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  login(docente: any): Observable<any> {
    let params = JSON.stringify(docente);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    //console.log(headers);

    return this.http.post<any>(this.URL + 'login', params, { headers: headers });
  }

  // login(docente: any): any {
  //   return this.http.post<any>(this.URL + 'login', docente);
  // }

  // signIn(user: Usuario): Observable<any> {
  //   let params = JSON.stringify(user);
  //   let headers = new HttpHeaders().set('Content-Type', 'application/json');

  //   return this._http.post(this.url + 'signin', params, { headers: headers });
  // }

  loginNoInstitutional(docente: any): any {
    return this.http.post<any>(this.URL + 'login-noi', docente);
  }

  setToken(token: any) {
    this.cookieService.set('token', token);
  }

  loggedIn(): boolean {
    return !!this.cookieService.get('token');
  }

  getToken(): any {
    return this.cookieService.get('token');
  }

  decodeToken(): any {
    return this.jwtHelper.decodeToken(this.getToken());
  }

  logout(): any {
    this.cookieService.delete('token');
  }
}
