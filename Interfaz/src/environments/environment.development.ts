const IP_HOST =  'http://192.168.1.2';

export const environment = {
    production: false,
    URL_DOC: IP_HOST + ':4000/api/documento/',
    URL_IMG: IP_HOST + ':4000/api/imagen/',
    URL_DP: IP_HOST + ':3000/api/docentes/',
    URL_LANG: IP_HOST + ':3002/api/idiomas/',
    URL_CERT: IP_HOST + ':3002/api/certificaciones/',
    URL_COUR: IP_HOST + ':3002/api/cursos/',
    URL_ACAD: IP_HOST + ':3002/api/datos_academicos/',
    URL_PUBL: IP_HOST + ':3002/api/publicaciones/',
    URL_EXPE: IP_HOST + ':3002/api/experiencias/',
    // URL_FT: IP_HOST + ':2000/api/facultad/',
};
