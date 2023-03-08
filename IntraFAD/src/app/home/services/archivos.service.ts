import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ArchivosService {
  private URL_DOC = environment.URL_DOC;
  private URL_IMG = environment.URL_IMG;

  constructor(private http: HttpClient, private loginService: AuthService) {}

  /**
   * Obtener la imagen de perfil de un docente
   * @returns Observable<any>
   * @since 1.0.0
   * @version 1.0.0
   */
  public getImage(): Observable<any> {
    const options = {
      responseType: "blob" as const,
    }
    return this.http.get(this.URL_IMG + 'get-image', options);
  }

  /**
   * Actualizar la imagen de perfil de un docente
   * @param img (FormData) Formulario con la imagen del docente
   * @returns Observable<any>
   * @since 1.0.0
   * @version 1.0.0
   */
  public uploadImage(formData: FormData): Observable <HttpEvent <any>> {
    const req = new HttpRequest<FormData>('POST', `${this.URL_IMG}upload-image`, formData);
    let respuesta = this.http.request(req);
    return respuesta;
  }
  

  getDoc(url: any) {
    let headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.loginService.getToken()
      );

      const options = {
        headers: headers,
        responseType: "blob" as const,
      }

      return this.http.get(this.URL_DOC + 'get-document' + url, { responseType: 'blob', observe: 'response'}).pipe(
        map((res: any) => {
          return new Blob([res.body], { type: 'application/pdf' });
        })
      );
  }

  setDoc(tipo: string, doc: any) {
    return this.http.put<any>(
      this.URL_DOC + 'upload-document/' + tipo,
      doc
    );
  }

  uploadDoc(tipo: string, formData: FormData): Observable <HttpEvent <any>> {
    const req = new HttpRequest<FormData>('POST', `${this.URL_DOC}upload-document/${tipo}`, formData);
    let respuesta = this.http.request(req);
    return respuesta;
  }
}
