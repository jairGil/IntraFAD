import { TestBed } from '@angular/core/testing';

import { AcademicDataService } from './academic-data.service';

describe('AcademicDataService', () => {
  let service: AcademicDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcademicDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
