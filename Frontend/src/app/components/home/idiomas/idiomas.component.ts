import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-idiomas',
  templateUrl: './idiomas.component.html',
  styleUrls: ['./idiomas.component.scss']
})
export class IdiomasComponent implements OnInit {
  @Input() token_data: any;

  constructor() { }

  ngOnInit(): void {
  }

}
