import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EventAction } from 'src/app/models/interfaces/event/EventAction';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsService } from 'src/app/services/products/product.service';
import { ProductDataTransferService } from 'src/app/shared/services/product/product-data-transfer.service';
import { ProductFormComponent } from '../../components/product-form/product-form.component';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
})
export class ProductsHomeComponent implements OnInit,OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private ref!:DynamicDialogRef;
  isLoading: boolean = false;


  public productsDatas:Array<GetAllProductsResponse> = [];

  constructor(
    private productService:ProductsService,
    private  productsDTO:ProductDataTransferService,
    private router:Router,
    private messageService:MessageService,
    private confirmationService:ConfirmationService,
    private dialogService:DialogService
  ) { }

  ngOnInit() {
    this.getServiceProductsDatas();
  }

  getServiceProductsDatas(){
    const productsLoaded = this.productsDTO.getProductsDatas();
    if(productsLoaded.length > 0) {
      this.productsDatas = productsLoaded;
    } else {
      this.getAPIProductsDatas();
    }
  }

  getAPIProductsDatas() {
    this.isLoading = true;
    this.productService.getAllProducts()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next:(response) => {
        if(response.length > 0) {
          this.productsDatas = response
          this.isLoading = false;
        }
      },
      error:(err) => {
        console.log(err)
        this.router.navigate(['/dashboard'])
        this.messageService.add({
          severity:'error',
          summary:'Erro.',
          detail:'Erro ao buscar produtos.',
          life:2000
        })
        this.isLoading = false;
      }
    })
  }

  handleProductAction(event:EventAction):void {
    if(event) {
      this.ref = this.dialogService.open(ProductFormComponent,{
        header:event?.action,
        width:'70%',
        contentStyle:{overFlow:'auto'},
        baseZIndex:10000,
        maximizable:true,
        data:{
          event:event,
          productDatas:this.productsDatas
        }
      })
      this.ref.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.getAPIProductsDatas()
      })
    }
  }

  handleDeleteProductAction(event:{product_id:number,product_name:string}):void {
    if(event) {
      this.confirmationService.confirm({
        message:`Confirma a exclusão do produto ${event?.product_name}?`,
        header:'Confirmação de exclusão',
        icon:'pi pi-exclamation-triangle',
        acceptLabel:'Sim',
        rejectLabel:'Não',
        accept: () => this.deleteProduct(event?.product_id)
      })
    }
  }

  deleteProduct(product_id:number) {
    this.isLoading = true;
    if(product_id) {
      this.productService.deleteProduct(product_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next:(response) => {
          this.getAPIProductsDatas();
            this.messageService.add({
              severity:'success',
              summary:'Sucesso',
              detail:'Produto Removido com sucesso!',
              life:2500
            })
            this.isLoading = false;
        },
        error:(err) => {
          console.log(err);
          this.messageService.add({
            severity:'error',
            summary:'Erro',
            detail:'Erro ao remover produto!',
            life:2500
          })
          this.isLoading = false;
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
