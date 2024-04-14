import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Subject, elementAt, takeUntil } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsService } from 'src/app/services/products/product.service';
import { ProductDataTransferService } from 'src/app/shared/services/product/product-data-transfer.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
})
export class DashboardHomeComponent implements OnInit,OnDestroy {  
  private destroy$ = new Subject<void>();

  public productsList:Array<GetAllProductsResponse> = [];
  public productsChartDatas!:ChartData;
  public productsChartOptions!:ChartOptions;

  constructor(private productService:ProductsService,private messageService:MessageService,private productsDTO:ProductDataTransferService) { }


  ngOnInit() {
    this.getProductsDatas();
  }

  getProductsDatas():void {
    this.productService.getAllProducts()
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe({
      next:(response) => {
        if(response.length > 0)
        this.productsList = response
        this.productsDTO.setProductsDatas(this.productsList)
        this.setProductsChartConfig();
      },
      error:(err) => {
        console.log(err)
        this.messageService.add({
          severity:'error',
          summary:'Erro',
          detail:'Erro ao buscar produtos',
          life:2000
        })
      }
    })
  }

  setProductsChartConfig():void {
   if(this.productsList.length > 0) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.productsChartDatas = {
      labels:this.productsList.map((element) => element?.name),
      datasets:[{
        label:'Quantidade',
        backgroundColor:documentStyle.getPropertyValue('--indigo-400'),
        borderColor:documentStyle.getPropertyValue('--indigo-400'),
        hoverBackgroundColor:documentStyle.getPropertyValue('--indigo-500'),
        data:this.productsList.map((element)=> element.amount)
      }]
    }

    this.productsChartOptions = {
      maintainAspectRatio:false,
      aspectRatio:0.8,
      plugins:{
        legend:{
          labels:{
            color:textColor
          }
        }
      },
      scales:{
        x:{
          ticks: {
            color:textColorSecondary,
            font:{
              weight:'bold'
            }
          },
          grid:{
            color:surfaceBorder
          }
        },
        y:{
          ticks:{
            color:textColorSecondary
          },
          grid:{
            color:surfaceBorder
          }
        }
      }
    }
   }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();  
  }
}
