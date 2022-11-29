import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './auth.guard';
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
import { RegisterInstitucionalComponent } from './components/register/institucional/institucional.component';
import { RegisterNoInstitucionalComponent } from './components/register/no-institucional/no-institucional.component';
import { LoginInstitucionalComponent } from './components/login/institucional/institucional.component';
import { LoginNoInstitucionalComponent } from './components/login/no-institucional/no-institucional.component';

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
    RegisterInstitucionalComponent,
    RegisterNoInstitucionalComponent,
    LoginInstitucionalComponent,
    LoginNoInstitucionalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
