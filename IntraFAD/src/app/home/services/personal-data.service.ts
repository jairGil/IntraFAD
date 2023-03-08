import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Docente } from '../models/docente.model';

@Injectable({
  providedIn: 'root'
})
export class PersonalDataService {
  private URL = environment.URL_DP;

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Obtener un docente por su id
   * @param id_docente 
   * @returns Observable<any>
   * @since 1.0.0
   * @version 1.0.0
   */
  public getDocente(id_docente: String): Observable<any> {
    return this.http.get<any>(this.URL + 'get-docente/' + id_docente);
  }

  /**
   * Actualizar los datos personales de un docente
   * @param docente
   * @returns Observable<any>
   * @since 1.0.0
   * @version 1.0.0
   */
  public updateDocente(docente: Docente): Observable<any> {
    return this.http.put<any>(this.URL + 'update-dp', docente);
  }
}
