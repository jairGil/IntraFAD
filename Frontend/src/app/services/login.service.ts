import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private URL = 'http://localhost:3001/api/docente';

  constructor(
    private http: HttpClient
  ) { }

  login(docente: any): any {
    return this.http.post<any>(this.URL + '/login', docente);
  }

  loggedIn(): Boolean {
    return !!localStorage.getItem('token');
  }
  
  getToken() {
    return localStorage.getItem('token');
  }
}
