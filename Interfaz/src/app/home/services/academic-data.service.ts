import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { AcademicData } from '../models/academic-data.model.';
import { QueryUpdate } from '../models/query-update.model';

@Injectable({
  providedIn: 'root'
})
export class AcademicDataService {
  private URL = environment.URL_ACAD;

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Obtener los datos academicos del docente
   * @param id_docente (String) ID del docente
   * @returns Observable<any>
   * @since 1.0.0
   * @version 1.0.0
   */
  getDatosAcademicos(id_docente: string): Observable<any> {
    return this.http.get<any>(this.URL + id_docente);
  }

  /**
   * Crear un nuevo dato academico
   * @param datoAcad 
   * @returns Observable<any>
   * @since 1.0.0
   * @version 1.0.0
   */
  addDatoAcademico(datoAcad: AcademicData): Observable<any> {
    return this.http.post<any>(this.URL, datoAcad);
  }

  /**
   * Actualizar un dato academico
   * @param query
   * @returns Observable<any>
   * @since 1.0.0
   * @version 1.0.0
   */
  update(query: QueryUpdate): Observable<any> {
    return this.http.put<any>(this.URL, query);
  }

  /**
   * Eliminar un dato academico
   * @param id_datoacad (String) ID del dato academico
   * @returns Observable<any>
   * @since 1.0.0
   * @version 1.0.0
   */
  deleteDatoAcademico(id_datoacad: string): Observable<any> {
    return this.http.delete<any>(this.URL + id_datoacad);
  }
}
