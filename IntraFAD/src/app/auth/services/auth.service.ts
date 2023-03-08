import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Docente } from '../models/docente.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwtHelper = new JwtHelperService();

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  /**
   * Registro de un docente
   * @param docente Datos del docente (correo_institucional, contrasena, confirma_contrasena)
   * @returns (Observable) Respuesta del servidor
   * @since 1.0.0
   * @version 1.0.1
   */
  public register(docente: Docente): Observable<any> {
    return this.http.post<any>(environment.URL_DP + 'register', docente);
  }

  /**
   * Inicio de sesion de un docente
   * @param docente Datos del docente (correo_institucional, contrasena)
   * @returns (Observable) Respuesta del servidor
   * @since 1.0.0
   * @version 1.0.1
   */
  public login(docente: Docente): Observable<any> {
    let params = JSON.stringify(docente);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post<any>(environment.URL_DP + 'login', params, { headers: headers });
  }
  
  /**
   * Verificar que un docente este autenticado (inicio de sesion)
   * @returns (boolean) Estado de autenticación
   * @since 1.0.0
   * @version 1.0.1
   */
  public loggedIn(): boolean {
    return !!this.cookieService.get('token');
  }

  /**
   * Cerrar la sesión de un docente
   * @returns void
   * @since 1.0.0
   * @version 1.0.1
   */
  public logout(): void {
    this.cookieService.deleteAll();
  }

  /**
   * Alojamiento del Token en una cookie
   * @param token Token de autenticación
   * @returns void
   * @since 1.0.0
   * @version 1.0.1
   */
  public setToken(token: string): void {
    if(!this.loggedIn()) {
      this.cookieService.set('token', token);
    }
  }

  /**
   * Obtener el Token de autenticación desde la cookie
   * @returns (string) Token de autenticación
   * @since 1.0.0
   * @version 1.0.1
   */
  public getToken(): string {
    return this.cookieService.get('token');
  }
  
  /**
   * Decodificar el contenido del Token almacenado en la cookie
   * @returns (any) Contenido del Token
   * @since 1.0.0
   * @version 1.0.1
   */
  public decodeToken(): any {
    return this.jwtHelper.decodeToken(this.getToken());
  }
}
