import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DaDocenteService {

  private URL = 'http://localhost:3002/api/dato_academico';

  constructor(
    private http: HttpClient
  ) { }

  getDatosAcademicos(id_docente: string) {
    return this.http.get<any>(this.URL + '/get_datoacad/' + id_docente);
  }

  addDatoAcademico(datoacad: any) {
    return this.http.post<any>(this.URL + '/add_datoacad', datoacad);
  }

  updateDatoAcademico(datoacad: any) {
    return this.http.put<any>(this.URL + '/update_datoacad', datoacad);
  }

  deleteDatoAcademico(id_datoacad: string) {
    return this.http.delete<any>(this.URL + '/delete_datoacad/' + id_datoacad);
  }
}
