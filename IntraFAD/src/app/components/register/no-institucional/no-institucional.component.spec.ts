import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoInstitucionalComponent } from './no-institucional.component';

describe('NoInstitucionalComponent', () => {
  let component: NoInstitucionalComponent;
  let fixture: ComponentFixture<NoInstitucionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoInstitucionalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoInstitucionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
