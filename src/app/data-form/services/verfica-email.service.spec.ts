import { TestBed } from '@angular/core/testing';

import { VerficaEmailService } from './verfica-email.service';

describe('VerficaEmailService', () => {
  let service: VerficaEmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerficaEmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
