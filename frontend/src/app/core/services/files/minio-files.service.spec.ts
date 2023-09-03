import { TestBed } from '@angular/core/testing';

import { MinioFilesService } from './minio-files.service';

describe('MinioFilesService', () => {
  let service: MinioFilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MinioFilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
