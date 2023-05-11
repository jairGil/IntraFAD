import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalitiesComponent } from './finalities.component';

describe('FinalitiesComponent', () => {
  let component: FinalitiesComponent;
  let fixture: ComponentFixture<FinalitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinalitiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinalitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
