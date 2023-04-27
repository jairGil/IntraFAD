import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ExperiencesService {

  private URL = environment.URL_EXPE;

  constructor(
    private http: HttpClient
  ) { }

  getExperiencias(id_docente: string) {
    return this.http.get<any>(this.URL + 'get/' + id_docente);
  }

  addExperiencia(experiencia: any) {
    return this.http.post<any>(this.URL + 'add', experiencia);
  }

  deleteExperiencia(id_experiencia: string) {
    return this.http.delete<any>(this.URL + 'delete/' + id_experiencia);
  }
}
