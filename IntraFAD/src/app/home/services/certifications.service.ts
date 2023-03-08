import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CertificationsService {

  private URL = environment.URL_CERT;

  constructor(
    private http: HttpClient
  ) { }

  getCertificaciones(id_docente: string) {
    return this.http.get<any>(this.URL + 'get_certs/' + id_docente);
  }

  addCertificacion(certificacion: any) {
    return this.http.post<any>(this.URL + 'add_cert', certificacion);
  }

  updateCertificacion(certificacion: any) {
    return this.http.put<any>(this.URL + 'update_cert', certificacion);
  }

  deleteCertificacion(id_certificacion: string) {
    return this.http.delete<any>(this.URL + 'delete_cert/' + id_certificacion);
  }
}
