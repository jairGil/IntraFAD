import { Injectable } from '@angular/core';
import { PlanEstudio } from '../models/plan-estudio.model';

@Injectable({
  providedIn: 'root'
})
export class StaticDataService {

  public static LISTA_ESTADOS = [
    'Aguascalientes',
    'Baja California',
    'Baja California Sur',
    'Campeche',
    'Chiapas',
    'Chihuahua',
    'Cuidad de México',
    'Coahuila',
    'Colima',
    'Durango',
    'Guanajuato',
    'Guerrero',
    'Hidalgo',
    'Jalisco',
    'Estado de México',
    'Michoacán',
    'Morelos',
    'Nayarit',
    'Nuevo León',
    'Oaxaca',
    'Puebla',
    'Querétaro',
    'Quintana Roo',
    'San Luis Potosí',
    'Sinaloa',
    'Sonora',
    'Tabasco',
    'Tamaulipas',
    'Tlaxcala',
    'Veracruz',
    'Yucatán',
    'Zacatecas',
  ] as const;

  public static LISTA_EMPLEOS = [ 
    "Profesor de asignatura",
    "Profesor tiempo completo",
    "Profesor medio tiempo",
    "Técnico académico de tiempo completo",
    "Técnico académico de medio tiempo",
    "Administrativo de confianza",
    "Administrativo sindicalizado",
  ] as const;

  public static LISTA_PLANES_ESTUDIO: ReadonlyArray<PlanEstudio> = [
    {nombre: "Licenciatura en Arquitectura", clave: "ARQ"},
    {nombre: "Licenciatura en Diseño Gráfico", clave: "LDG"},
    {nombre: "Licenciatura en Diseño Industrial", clave: "LDI"},
    {nombre: "Licenciatura en Administración y Promoción de la Obra Urbana", clave: "APOU"},
    {nombre: "Especialidad en Accesibilidad Universal en la Arquitectura y la Ciudad", clave: "AUAC"},
    {nombre: "Especialidad en Valuación de Bienes Inmuebles", clave: "VBI"},
    {nombre: "Maestría en Diseño", clave: "MD"},
    {nombre: "Maestria en Estudios Sustentables", clave: "MES"},
    {nombre: "Doctorado en Diseño", clave: "DD"},
    {nombre: "Diplomado Superior de Fotografía Profesional", clave: "DSFP"},
  ] as const;

  constructor() { }
}
