import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ArchivosService } from 'src/app/services/archivos.service';
import { IdiomasService } from 'src/app/services/idiomas.service';

@Component({
  selector: 'app-idiomas',
  templateUrl: './idiomas.component.html',
  styleUrls: ['../../../app.component.css','./idiomas.component.scss']
})
export class IdiomasComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<object>();
  @Input() token_data: any;

  public modo_agregar = false;
  public idiomas: any;
  public URL_DOC = 'http://localhost:3000/api/documento/get-document/';

  public docCur: boolean = false;

  idioForm = this.formBuilder.group({
    nombre: ['', Validators.required],
    nivel: ['', Validators.required],
    fecha_fin: ['', Validators.required],
    institucion: ['', Validators.required],
    constancia: ['', Validators.required]
  });

  constructor(
    private idiomaService: IdiomasService,
    private archivosService: ArchivosService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getIdioma();
    this.modo_agregar = false;
  }

  getIdioma() {
    this.idiomaService.getIdiomas(this.token_data.id).subscribe(
      (res: any) => {
        this.idiomas = res.idioma;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  deleteIdioma(id: string) {
    this.idiomaService.deleteIdioma(id).subscribe(
      (res: any) => {
        this.getIdioma();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  cambiarModo(modo: number) {
    switch (modo) {
      case 1:
        this.modo_agregar = true;
        break;
      case 2:
        this.modo_agregar = false;
        break;
    }
  }

  enviarDatos() {
    this.uploadDocument('idiomas', 'constancia_F');


    console.log(this.idioForm.value);
    this.idiomaService.addIdioma(this.idioForm.value).subscribe(
      (res: any) => {
        console.log(res);
      },
      (err: any) => {
        console.log(err);
      }
    );

  }

  onIdiomaSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.idioForm.get('constancia')?.setValue(file);
      this.docCur = true;
    }
  }

  uploadDocument(tipo: string, campo: string) {
    const formData = new FormData();

    formData.append(tipo, this.idioForm.get(campo)?.value!);
    this.archivosService.setDoc(tipo, this.token_data.id, formData).subscribe(
      (res: any) => {
        console.log(res);
      },
      (err: any) => {
        console.log(err);
      });
  }

  get nombre() { return this.idioForm.get('nombre'); }
  get nivel() { return this.idioForm.get('nivel'); }
  get fecha_fin() { return this.idioForm.get('fecha_fin'); }
  get institucion() { return this.idioForm.get('institucion'); }
  get constancia() { return this.idioForm.get('constancia'); }

}
