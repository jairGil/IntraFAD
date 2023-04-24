import { PlanEstudio } from "./plan-estudio.model";

export interface DocenteSend {
    nombre: String;
    apellido_p: String;
    apellido_m: String;
    direccion: String;
    correo_personal: String;
    correo_institucional: String;
    telefono: String;
    rfc: String;
    curp: String;
    rol: String;
    no_empleado: String;
    planes_estudio: PlanEstudio[];
    tipoContrato: String;
    contratoDefinitivo: Boolean;
}


export interface Docente extends DocenteSend {
    _id: String;
    img: String;
    doc_rfc: String;
    doc_curp: String;
}