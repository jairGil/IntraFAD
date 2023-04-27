import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {

  private URL = environment.URL_PUBL;

  constructor(
    private http: HttpClient
  ) { }

  getPublicaciones(id_docente: string) {
    return this.http.get<any>(this.URL + 'get/' + id_docente);
  }

  addPublicacion(publicacion: any) {
    return this.http.post<any>(this.URL + 'add', publicacion);
  }

  deletePublicacion(id_publicacion: string) {
    return this.http.delete<any>(this.URL + 'delete/' + id_publicacion);
  }
}
