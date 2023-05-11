import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  
  private URL = environment.URL_COUR;

  constructor(
    private http: HttpClient
  ) { }

  getCursos(id_docente: string) {
    return this.http.get<any>(this.URL + id_docente);
  }

  addCurso(curso: any) {
    return this.http.post<any>(this.URL, curso);
  }

  updateCurso(curso: any) {
    return this.http.put<any>(this.URL, curso);
  }

  deleteCurso(id_curso: string) {
    return this.http.delete<any>(this.URL + id_curso);
  }
}
