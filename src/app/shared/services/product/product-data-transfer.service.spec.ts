/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProductDataTransferService } from './product-data-transfer.service';

describe('Service: ProductDataTransfer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductDataTransferService]
    });
  });

  it('should ...', inject([ProductDataTransferService], (service: ProductDataTransferService) => {
    expect(service).toBeTruthy();
  }));
});
