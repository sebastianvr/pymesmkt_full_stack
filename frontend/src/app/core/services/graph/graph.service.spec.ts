import { TestBed } from '@angular/core/testing';

import { GraphService } from './graph.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GraphService', () => {
  let service: GraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(GraphService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
