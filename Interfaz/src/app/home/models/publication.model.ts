export interface Publication {
    formato: string;
    tipo: string;
    autores: string;
    fecha: Date;
    titulo: string;
    editorial?: string;
    doi_url?: string;
    id_docente: string;
}