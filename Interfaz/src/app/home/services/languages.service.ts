import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LanguagesService {

  private URL = environment.URL_LANG;

  constructor(
    private http: HttpClient
  ) { }

  getIdiomas(id_docente: string) {
    return this.http.get<any>(this.URL + id_docente);
  }

  addIdioma(idioma: any) {
    return this.http.post<any>(this.URL, idioma);
  }

  updateIdioma(idioma: any) {
    return this.http.put<any>(this.URL, idioma);
  }

  deleteIdioma(id_idioma: string) {
    return this.http.delete<any>(this.URL + id_idioma);
  }
}

