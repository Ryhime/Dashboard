import { TestBed } from '@angular/core/testing';

import { BackendService } from './backend.service';
import { HttpClient } from '@angular/common/http';

describe('BackendService', () => {
  let service: BackendService;

  let mockHttpClient: any;

  beforeEach(() => {
    mockHttpClient = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({
      providers: [
        {provide: HttpClient, useValue: mockHttpClient},
      ],
    }).compileComponents();
    service = TestBed.inject(BackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('updateNetworkdataUrl', () => {
    it('should reassign the network data observable', () => {
      service.updateNetworkDataUrl(500);
      expect(mockHttpClient['get']).toHaveBeenCalled();
    });
  });
});
