import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.scss']
})
export class CursosComponent implements OnInit {
  @Input() token_data: any;

  constructor() { }

  ngOnInit(): void {
  }

}
