import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DpDocenteService {
  private URL = 'http://localhost:3001/api/docente';

  constructor(
    private http: HttpClient
  ) { }

  register(docente: any) {
    return this.http.post<any>(this.URL + '/register', docente);
  }

  registerNoInstitutional(docente: any) {
    return this.http.post<any>(this.URL + '/register-noi', docente);
  }

  updateDocente(docente: any) {
    return this.http.put<any>(this.URL + '/update-dp', docente);
  }
}
