import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { DialogService } from 'primeng/dynamicdialog';
import { ProductEvent } from 'src/app/models/enums/product/ProductEvent';
import { ProductFormComponent } from 'src/app/modules/products/components/product-form/product-form.component';

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
})
export class ToolbarNavigationComponent implements OnInit {

  constructor(private cookieService:CookieService,private router:Router,private dialogService:DialogService) { }

  ngOnInit() {
  }

  handleLogout():void {
    this.cookieService.delete('USER_INFO');
    void this.router.navigate(['/home'])
  }

  handleSaleProduct(){
    const saleProductAction = ProductEvent.SALE_PRODUCT_EVENT;
    this.dialogService.open(ProductFormComponent,{
      header:ProductEvent.SALE_PRODUCT_EVENT,
      width:'70%',
      contentStyle:{overFlow:'auto'},
      baseZIndex:10000,
      maximizable:true,
      data:{
        event:{action:saleProductAction}
      }
    })
  }

}
