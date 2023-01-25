import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CursosService {

  private URL = 'http://localhost:3002/api/curso';
  
  constructor(
    private http: HttpClient
  ) { }

  getCursos(id_docente: string) {
    return this.http.get<any>(this.URL + '/get_curso/' + id_docente);
  }

  addCurso(curso: any) {
    return this.http.post<any>(this.URL + '/add_curso', curso);
  }

  updateCurso(curso: any) {
    return this.http.put<any>(this.URL + '/update_curso', curso);
  }

  deleteCurso(id_curso: string) {
    return this.http.delete<any>(this.URL + '/delete_curso/' + id_curso);
  }
}
