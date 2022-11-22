import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprobarDatosComponent } from './comprobar-datos.component';

describe('ComprobarDatosComponent', () => {
  let component: ComprobarDatosComponent;
  let fixture: ComponentFixture<ComprobarDatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComprobarDatosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComprobarDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
