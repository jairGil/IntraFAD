import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment.development';
import { FileSend } from '../models/file-send.model';

@Injectable({
  providedIn: 'root',
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
      responseType: 'blob' as const,
    };
    return this.http.get(this.URL_IMG + 'get-image', options);
  }

  /**
   * Actualizar la imagen de perfil de un docente
   * @param img (FormData) Formulario con la imagen del docente
   * @returns Observable<any>
   * @since 1.0.0
   * @version 1.0.0
   */
  public uploadImage(formData: FormData): Observable<HttpEvent<any>> {
    const req = new HttpRequest<FormData>(
      'POST',
      `${this.URL_IMG}upload-image`,
      formData
    );
    let respuesta = this.http.request(req);
    return respuesta;
  }

  /**
   * Obtener documento de Identidad (RFC o CURP)
   * @param dir Direccióön del documento en el servidor
   * @param id ID del docente
   * @returns Objeto Blob del documento
   */
  getIDDoc(dir: String, id: String): Observable<Blob>{
    const options = {
      responseType: "blob" as 'json',
    }
    const body = { idDocente: id }
    return this.http.get<any>(this.URL_DOC + 'get-document/' + dir, options);
  }

  getDoc(url: any) {
    let headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + this.loginService.getToken()
    );

    const options = {
      headers: headers,
      responseType: 'blob' as const,
    };

    return this.http
      .get(this.URL_DOC + 'get-document' + url, {
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(
        map((res: any) => {
          return new Blob([res.body], { type: 'application/pdf' });
        })
      );
  }

  setDoc(tipo: string, doc: any) {
    return this.http.put<any>(this.URL_DOC + 'upload-document/' + tipo, doc);
  }

  /**
   * Subir documentos de la Ficha Técnica Docente
   * @param formData Formulario con los documentos
   * @returns Observable<HttpEvent<any>>
   * @since 1.1.0
   * @version 1.0.0
   * @public
   */
  public setFTDoc(formData: FormData, fileData: FileSend): Observable<HttpEvent<any>> {
    let url = this.URL_DOC + 'upload-ft-doc/' + fileData.type + '/' + fileData.name + '/' + fileData.date;
    return this.http.put<any>(url, formData);
  }
  
  /**
   * Obtener la imagen del servidor y colocarla en la interfaz
   * @returns void
   * @since 1.0.0
   * @version 1.1.0
   * @public
   */
  public async getImageSrc(): Promise<string> {
    try {
      const res = await firstValueFrom(this.getImage());
      const imagen = await ArchivosService.createImageFromBlob(res);
      return imagen;
    } catch (err) {
      return 'assets/img/default.png';
    }
  }

  /**
   * Crear imagen a partir de un Blob
   * @returns void
   * @param image (Blob) - Imagen en formato Blob
   * @since 1.0.0
   * @version 1.1.0
   * @private
   */
  public static createImageFromBlob(image: Blob): Promise<string> {
    return new Promise((resolve) => {
      let reader = new FileReader();
      reader.addEventListener(
        'load',
        () => {
          resolve(reader.result!.toString());
        },
        false
      );
      if (image) {
        reader.readAsDataURL(image);
      }
    });
  }
}
