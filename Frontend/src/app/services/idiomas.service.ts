import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdiomasService {

  private URL = 'http://localhost:3002/api/idioma';

  constructor(
    private http: HttpClient
  ) { }

  getIdiomas(id_docente: string) {
    return this.http.get<any>(this.URL + '/get_idioma/' + id_docente);
  }

  addIdioma(idioma: any) {
    return this.http.post<any>(this.URL + '/add_idioma', idioma);
  }

  updateIdioma(idioma: any) {
    return this.http.put<any>(this.URL + '/update_idioma', idioma);
  }

  deleteIdioma(id_idioma: string) {
    return this.http.delete<any>(this.URL + '/delete_idioma/' + id_idioma);
  }
}
