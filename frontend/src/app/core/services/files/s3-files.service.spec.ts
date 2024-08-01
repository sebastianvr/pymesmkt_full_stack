import { TestBed } from '@angular/core/testing';

import { S3FilesService } from './s3-files.service';

describe('MinioFilesService', () => {
  let service: S3FilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(S3FilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
