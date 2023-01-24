import { TestBed } from '@angular/core/testing';

import { DaDocenteService } from './da-docente.service';

describe('DaDocenteService', () => {
  let service: DaDocenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DaDocenteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
