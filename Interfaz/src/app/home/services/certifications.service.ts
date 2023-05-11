import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { QueryUpdate } from '../models/query-update.model';

@Injectable({
  providedIn: 'root'
})
export class CertificationsService {

  private URL = environment.URL_CERT;

  constructor(
    private http: HttpClient
  ) { }

  getCertificaciones(id_docente: string) {
    return this.http.get<any>(this.URL + id_docente);
  }

  addCertificacion(certificacion: any) {
    return this.http.post<any>(this.URL, certificacion);
  }

  updateCertificacion(query: QueryUpdate) {
    return this.http.put<any>(this.URL, query);
  }

  deleteCertificacion(id_certificacion: string) {
    return this.http.delete<any>(this.URL + id_certificacion);
  }
}
