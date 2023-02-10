import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DpDocenteService {
  private URL = environment.URL_DP;

  constructor(
    private http: HttpClient
  ) { }

  register(docente: any) {
    return this.http.post<any>(this.URL + 'register', docente);
  }

  registerNoInstitutional(docente: any) {
    return this.http.post<any>(this.URL + 'register-noi', docente);
  }

  getDocente(id_docente: string) {
    return this.http.get<any>(this.URL + 'get-docente/' + id_docente);
  }

  updateDocente(docente: any) {
    return this.http.put<any>(this.URL + 'update-dp', docente);
  }
}
