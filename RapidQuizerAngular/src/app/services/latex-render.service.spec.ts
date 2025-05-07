import { TestBed } from '@angular/core/testing';

import { LatexRenderService } from './latex-render.service';

describe('LatexRenderService', () => {
  let service: LatexRenderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LatexRenderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
