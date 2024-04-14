/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CategorieDataTransferService } from './categorie-data-transfer.service';

describe('Service: CategorieDataTransfer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategorieDataTransferService]
    });
  });

  it('should ...', inject([CategorieDataTransferService], (service: CategorieDataTransferService) => {
    expect(service).toBeTruthy();
  }));
});
