import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class ArchivosService {
  // private URL_DOC = 'http://localhost:3000/api/documento';
  // private URL_IMG = 'http://localhost:3000/api/imagen';

  private URL_DOC = environment.URL_DOC;
  private URL_IMG = environment.URL_IMG;

  constructor(private http: HttpClient, private loginService: LoginService) {}

  getImage() {
    // let params = JSON.stringify(docente);
    // console.log('Token antes de la peticion', this.loginService.getToken());
    //let headers = new HttpHeaders().set(
    //  'Authorization',
    //  'Bearer ' + this.loginService.getToken()
    //);
    // console.log('headers: ' + JSON.stringify(headers));

    const options = {
      //headers: headers,
      responseType: "blob" as const,
    }

    return this.http.get(this.URL_IMG + 'get-image', options);
  }


/* SUBIR IMAGEN */
  uploadImage(formData: FormData): Observable <HttpEvent <any>> {
    const req = new HttpRequest<FormData>('POST', `${this.URL_IMG}upload-image`, formData);
    let respuesta = this.http.request(req);
    return respuesta;
  }

  //Obtener documento de Identidad RFC o CURP 
  getIDDoc(type: String, id: String): Observable<Blob>{
      const options = {
        responseType: "blob" as 'json',
      }
      const body = {idDocente: id}
      return this.http.get<any>(this.URL_DOC + 'get-document/' + type, options);
  }

  setDoc(tipo: string, doc: any) {
    return this.http.put<any>(
      this.URL_DOC + 'upload-document/' + tipo,
      doc
    );
  }

  uploadDoc(tipo: string, formData: FormData): Observable <HttpEvent <any>> {
    // return this.http.put<any>(
    //   this.URL_DOC + 'upload-document/' + tipo,
    //   doc
    // );
    const req = new HttpRequest<FormData>('POST', `${this.URL_DOC}upload-document/${tipo}`, formData);
    let respuesta = this.http.request(req);
    return respuesta;
  }

  setDocFT(tipo: string, docenteID: any, idFT: any, doc: any) {
    return this.http.put<any>(
      this.URL_DOC +
        'upload-document-ft/' +
        tipo +
        '/' +
        docenteID +
        '/' +
        idFT,
      doc
    );
  }
}
