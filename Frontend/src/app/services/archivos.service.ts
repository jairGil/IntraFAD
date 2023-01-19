import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ArchivosService {

  private URL_DOC = 'http://localhost:3000/api/documento';
  private URL_IMG = 'http://localhost:3000/api/imagen';

  constructor(
    private http: HttpClient
  ) { }

  getImage(url: any) {
    return this.http.get(this.URL_IMG + '/get-image/' + url);
  }

  setImage(docenteID: any, img: any) {
    return this.http.put<any>(this.URL_IMG + '/upload-image/' + docenteID, img);
  }

  getDoc(url: any) {
    return this.http.get<any>(this.URL_DOC + '/get-document/' + url);
  }

  setDoc(tipo: string, docenteID: any, doc: any) {
    return this.http.put<any>(this.URL_DOC + '/upload-document/' + tipo + '/' + docenteID, doc);
  }
}
