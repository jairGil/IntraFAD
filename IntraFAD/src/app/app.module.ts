import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DatosPersonalesComponent } from './components/home/datos-personales/datos-personales.component';
import { ExitoComponent } from './components/register/exito/exito.component';
import { DatosAcademicosComponent } from './components/home/datos-academicos/datos-academicos.component';
import { FichaTecnicaComponent } from './components/home/ficha-tecnica/ficha-tecnica.component';
import { CursosComponent } from './components/home/cursos/cursos.component';
import { CertificacionesComponent } from './components/home/certificaciones/certificaciones.component';
import { IdiomasComponent } from './components/home/idiomas/idiomas.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    RegisterComponent,
    HomeComponent,
    DatosPersonalesComponent,
    ExitoComponent,
    DatosAcademicosComponent,
    FichaTecnicaComponent,
    CursosComponent,
    CertificacionesComponent,
    IdiomasComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide : HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi   : true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
