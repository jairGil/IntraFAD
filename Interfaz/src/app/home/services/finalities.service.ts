import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FinalitiesService {

  private URL = environment.URL_FINA;

  constructor(
    private http: HttpClient
  ) { }

  getDefinitividades(id_docente: string) {
    return this.http.get<any>(this.URL + 'get/' + id_docente);
  }

  addDefinitividad(definitividad: any) {
    return this.http.post<any>(this.URL + 'add', definitividad);
  }

  deleteDefinitividad(id_definitividad: string) {
    return this.http.delete<any>(this.URL + 'delete/' + id_definitividad);
  }
}
