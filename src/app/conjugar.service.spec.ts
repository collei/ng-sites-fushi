import { TestBed } from '@angular/core/testing';

import { ConjugarService } from './conjugar.service';

describe('ConjugarService', () => {
  let service: ConjugarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConjugarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
