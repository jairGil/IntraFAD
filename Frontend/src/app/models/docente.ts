export class Docente {
    private _id!: string;
    private img!: string;
    private nombre!: string;
    private aPaterno!: string;
    private aMaterno!: string;
    private direccion!: string;
    private telefono!: string;
    private correoPersonal!: string;
    private correoInstitucional: string;
    private contrasena: string;
    private rol!: string;
    private noEmpleado!: string;
    private rfc!: string;
    private docRfc!: string;
    private curp!: string;
    private docCurp!: string;

    constructor(correoInstitucional: string, contrasena: string) {
        this.correoInstitucional = correoInstitucional;
        this.contrasena = contrasena;
    }
}