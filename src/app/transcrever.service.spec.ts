import { TestBed } from '@angular/core/testing';

import { TranscreverService } from './transcrever.service';

describe('TranscreverService', () => {
  let service: TranscreverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranscreverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
