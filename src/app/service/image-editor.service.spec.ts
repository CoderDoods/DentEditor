import { TestBed, inject } from '@angular/core/testing';

import { ImageEditorService } from './image-editor.service';

describe('ImageEditorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageEditorService]
    });
  });

  it('should be created', inject([ImageEditorService], (service: ImageEditorService) => {
    expect(service).toBeTruthy();
  }));
});
