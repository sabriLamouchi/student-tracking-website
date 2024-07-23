import { TestBed } from '@angular/core/testing';

import { ScolarService } from './scolar.service';

describe('ScolarService', () => {
  let service: ScolarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScolarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
