import { TestBed } from '@angular/core/testing';

import { FinalitiesService } from './finalities.service';

describe('FinalitiesService', () => {
  let service: FinalitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinalitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
