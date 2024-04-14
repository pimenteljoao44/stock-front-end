import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductEvent } from 'src/app/models/enums/product/ProductEvent';
import { EventAction } from 'src/app/models/interfaces/event/EventAction';
import { DeleteProductAction } from 'src/app/models/interfaces/products/event/DeleteProductAction';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
})
export class ProductsTableComponent implements OnInit {
  public productSelected!:GetAllProductsResponse;
  public addProductEvent = ProductEvent.ADD_PRODUCT_EVNT;
  public editProductEvent = ProductEvent.EDIT_PRODUCT_EVENT;
  @Input() products:Array<GetAllProductsResponse> = [];
  @Output() productEvent = new EventEmitter<EventAction>();
  @Output() deleteProductEvent = new EventEmitter<DeleteProductAction>();

  constructor() { }

  public handleProdctEvent(action:string, id?:number):void {
    if(action && action !== '') {
      const productEventData = id && id !== null? {action,id} : {action};
      this.productEvent.emit(productEventData)
    }
  }

  handleDeleteProduct(product_id:number,product_name:string):void {
    if (product_id !== null && product_name !== '') {
      this.deleteProductEvent.emit({product_id,product_name})
    }
  }

  ngOnInit() {
  }

}
