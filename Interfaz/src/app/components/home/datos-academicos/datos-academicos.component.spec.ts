import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosAcademicosComponent } from './datos-academicos.component';

describe('DatosAcademicosComponent', () => {
  let component: DatosAcademicosComponent;
  let fixture: ComponentFixture<DatosAcademicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosAcademicosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosAcademicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
