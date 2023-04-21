import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ArchivosService } from 'src/app/services/archivos.service';
import { CursosService } from 'src/app/services/cursos.service';


@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['../../../app.component.css','./cursos.component.scss']
})
export class CursosComponent implements OnInit {
  @Output() messageEvent = new EventEmitter<object>();
  @Input() token_data: any;

  public modo_agregar = false;
  public cursos: any;
  public URL_DOC = 'http://localhost:3000/api/documento/get-document/';

  public docCur: boolean = false;

  curForm = this.formBuilder.group({
    tipo: ['', Validators.required],
    nombre: ['', Validators.required],
    fecha_fin: ['', Validators.required],
    institucion: ['', Validators.required],
    duracion: ['', Validators.required],
    constancia: ['', Validators.required]
  });

  constructor(
    private cursoService: CursosService,
    private archivosService: ArchivosService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getCurso();
    this.modo_agregar = false;
  }

  getCurso() {
    this.cursoService.getCursos(this.token_data.id).subscribe(
      (res: any) => {
        this.cursos = res.curso;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  deleteCurso(id: string) {
    this.cursoService.deleteCurso(id).subscribe(
      (res: any) => {
        this.getCurso();
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
    this.uploadDocument('cursos', 'constancia_F');


    console.log(this.curForm.value);
    this.cursoService.addCurso(this.curForm.value).subscribe(
      (res: any) => {
        console.log(res);
      },
      (err: any) => {
        console.log(err);
      }
    );

  }

  onCursoSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.curForm.get('constancia')?.setValue(file);
      this.docCur = true;
    }
  }

  uploadDocument(tipo: string, campo: string) {
    const formData = new FormData();

    formData.append(tipo, this.curForm.get(campo)?.value!);
    this.archivosService.setDoc(tipo, formData).subscribe(
      (res: any) => {
        console.log(res);
      },
      (err: any) => {
        console.log(err);
      });
  }

  get nombre() { return this.curForm.get('nombre'); }
  get tipo() { return this.curForm.get('tipo'); }
  get fecha_fin() { return this.curForm.get('fecha_fin'); }
  get institucion() { return this.curForm.get('institucion'); }
  get duracion() { return this.curForm.get('duracion'); }
  get constancia() { return this.curForm.get('constancia'); }
  
}
