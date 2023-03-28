import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Docente } from '../models/docente.model';

export class FormUtils {
  private static formBuilder: FormBuilder = new FormBuilder();


  /* REGULAR EXPRESSIONS */
  private static regex_num = /^([0-9])*$/;
  private static regex_institucional =
    /([a-z0-9]{3,})+\@+(profesor\.|)+(uaemex\.mx)/;
  private static regex_personal = /([\w\.]+)@([\w\.]+)\.(\w+)/;

  /**
   * Inicializa el formulario de datos personales
   * @returns void
   * @private
   * @since 1.0.0
   * @version 1.1.0
   */
  public static buildForm(): FormGroup {
    return FormUtils.formBuilder.group({
      img: [''],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido_p: ['', [Validators.required, Validators.minLength(3)]],
      apellido_m: ['', [Validators.required, Validators.minLength(3)]],
      calle: ['', [Validators.required, Validators.minLength(3)]],
      no_ext: [''],
      no_int: [''],
      colonia: ['', [Validators.required, Validators.minLength(3)]],
      estado: ['', [Validators.required, Validators.minLength(3)]],
      municipio: ['', [Validators.required, Validators.minLength(3)]],
      cp: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.pattern(this.regex_num),
        ],
      ],
      correo_personal: ['', [Validators.pattern(this.regex_personal)]],
      correo_institucional: [
        '',
        [Validators.pattern(this.regex_institucional)],
      ],
      telefono: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.pattern(this.regex_num),
        ],
      ],
      rfc: [
        '',
        [
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(13),
        ],
      ],
      doc_rfc: ['', [Validators.required]],
      curp: [
        '',
        [
          Validators.required,
          Validators.minLength(18),
          Validators.maxLength(18),
        ],
      ],
      doc_curp: ['', [Validators.required]],
      no_empleado: [
        '',
        [Validators.maxLength(6), Validators.pattern(this.regex_num)],
      ],
      contratoDefinitivo: [false],
      tipoContrato: [''],
      ldg: [false],
      ldi: [false],
      arq: [false],
      apou: [false],
    });
  }

  /**
   * Colocar los datos del docente en el formulario
   * @returns void
   * @since 1.0.0
   * @version 1.1.0
   */
  public static setDataDocente(form: FormGroup, dataDocente: Docente): FormGroup {
    dataDocente = this.cleanDataDocente(dataDocente);

    form.get('nombre')?.setValue(dataDocente.nombre);
    form.get('apellido_p')?.setValue(dataDocente.apellido_p);
    form.get('apellido_m')?.setValue(dataDocente.apellido_m);
    form.get('correo_personal')?.setValue(dataDocente.correo_personal);
    form
      .get('correo_institucional')
      ?.setValue(dataDocente.correo_institucional);
    form.get('telefono')?.setValue(dataDocente.telefono);
    form.get('no_empleado')?.setValue(dataDocente.no_empleado);
    form.get('img')?.setValue(dataDocente.img);
    form.get('rfc')?.setValue(dataDocente.rfc);
    form.get('curp')?.setValue(dataDocente.curp);
    form.get('doc_rfc')?.setValue(dataDocente.doc_rfc);
    form.get('doc_curp')?.setValue(dataDocente.doc_curp);
    form.get('ldg')?.setValue(dataDocente.ldg);
    form.get('ldi')?.setValue(dataDocente.ldi);
    form.get('arq')?.setValue(dataDocente.arq);
    form.get('apou')?.setValue(dataDocente.apou);
    form.get('tipoContrato')?.setValue(dataDocente.tipoContrato);
    form.get('contratoDefinitivo')?.setValue(dataDocente.contratoDefinitivo);

    if (dataDocente.direccion != 'No ingresado') {
      let direccion = dataDocente.direccion.split(', ');
      form.get('calle')?.setValue(direccion[0]);
      form.get('no_ext')?.setValue(direccion[1]);
      form.get('no_int')?.setValue(direccion[2]);
      form.get('colonia')?.setValue(direccion[3]);
      form.get('municipio')?.setValue(direccion[4]);
      form.get('estado')?.setValue(direccion[5]);
      form.get('cp')?.setValue(direccion[6]);
    }

    
    if (dataDocente.correo_institucional != "") {
      form.controls['correo_institucional'].disable();
    }

    return form;
  }

  /**
   * Limpiar los datos por defecto del docente
   * @returns (Docente) Docente con sus campos limpios
   * @since 1.1.0
   * @version 1.1.0
   */
  public static cleanDataDocente(dataDocente: Docente): Docente {
    if (dataDocente.nombre == 'No ingresado') dataDocente.nombre = '';

    if (dataDocente.apellido_p == 'No ingresado') dataDocente.apellido_p = '';

    if (dataDocente.apellido_m == 'No ingresado') dataDocente.apellido_m = '';

    if (dataDocente.correo_personal == 'no_inicializado@mail.com')
      dataDocente.correo_personal = '';

    if (dataDocente.correo_institucional == 'no_inicializado@uaemex.com')
      dataDocente.correo_institucional = '';

    if (dataDocente.telefono == '0000000000') dataDocente.telefono = '';

    if (dataDocente.no_empleado == '0000000') dataDocente.no_empleado = '';

    if (dataDocente.rfc == 'ABCD123456789') dataDocente.rfc = '';

    if (dataDocente.curp == 'ABCD123456EFGHIJK0') dataDocente.curp = '';

    return dataDocente;
  }

  /**
   * Generar la dirección del docente
   * @returns string
   * @private
   * @since 1.0.0
   * @version 1.1.0
   */
  public static makeDireccion(form: FormGroup): string {
    if (form.get('no_ext')?.value == '' || form.get('no_ext')?.value == null) {
      form.get('no_ext')?.setValue('SN');
    }

    if (form.get('no_int')?.value == '' || form.get('no_int')?.value == null) {
      form.get('no_int')?.setValue('SN');
    }

    return (
      form.get('calle')?.value + ', ' +
      form.get('no_ext')?.value + ', ' +
      form.get('no_int')?.value + ', ' +
      form.get('colonia')?.value + ', ' +
      form.get('municipio')?.value + ', ' +
      form.get('estado')?.value + ', ' +
      form.get('cp')?.value
    );
  }

  /**
   * Obtener los nombres de los archivos
   * @returns (Object) Nombres de los archivos
   * @since 1.1.0
   * @version 1.1.0
   * @param dataDocente
   */
  public static setFileNames(dataDocente: Docente): object {
    return {
      rfcFilename: dataDocente.doc_rfc,
      curpFilename: dataDocente.doc_curp,
    };
  }
}
