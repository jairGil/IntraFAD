import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicDataComponent } from './academic-data.component';

describe('AcademicDataComponent', () => {
  let component: AcademicDataComponent;
  let fixture: ComponentFixture<AcademicDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcademicDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcademicDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
