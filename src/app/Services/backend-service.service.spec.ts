import { TestBed } from '@angular/core/testing';

import { BackendServiceService } from './backend-service.service';
import { HttpClient } from '@angular/common/http';

describe('BackendServiceService', () => {
  let service: BackendServiceService;
  let mockHttpClient: unknown;

  function createMocks() {
    mockHttpClient = jasmine.createSpyObj('HttpClient', ['get']);
  }
  
  beforeEach(() => {
    createMocks();
    TestBed.configureTestingModule({
      providers: [
        {provide: HttpClient, useValue: mockHttpClient}
      ]
    });
    service = TestBed.inject(BackendServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
