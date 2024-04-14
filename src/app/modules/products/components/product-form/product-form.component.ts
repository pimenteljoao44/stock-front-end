import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { ProductEvent } from 'src/app/models/enums/product/ProductEvent';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetCategoriesResponse';
import { EventAction } from 'src/app/models/interfaces/event/EventAction';
import { CreateProductRequest } from 'src/app/models/interfaces/products/request/CreateProductRequest';
import { EditProductRequest } from 'src/app/models/interfaces/products/request/EditProductRequest';
import { SaleProductRequest } from 'src/app/models/interfaces/products/request/SaleProductRequest';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { CategoryService } from 'src/app/services/category/category.service';
import { ProductsService } from 'src/app/services/products/product.service';
import { ProductDataTransferService } from 'src/app/shared/services/product/product-data-transfer.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public categoriesDatas: Array<GetCategoriesResponse> = [];
  public categorySelected!: GetCategoriesResponse;
  public saleProductSelected!:GetAllProductsResponse;
  public productAction!:{
    event:EventAction,
    productDatas:Array<GetAllProductsResponse>
  }
  public productSelectedDatas!:GetAllProductsResponse;
  public productDatas:Array<GetAllProductsResponse> = [];
  public addProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: [0, Validators.required],
    description: ['', Validators.required],
    category: this.formBuilder.group({
      categoryId: [null, Validators.required],
      name: ['', Validators.required]
    }),
    amount: [0, Validators.required]
  });

  public editProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: [0, Validators.required],
    description: ['', Validators.required],
    amount: [0, Validators.required]
  })

  public saleProductForm = this.formBuilder.group({
    quantitySold:[0,Validators.required],
    productId:[0,Validators.required]
  })

  public addProductAction = ProductEvent.ADD_PRODUCT_EVNT;
  public editProductAction = ProductEvent.EDIT_PRODUCT_EVENT;
  public saleProductAction = ProductEvent.SALE_PRODUCT_EVENT;


  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductsService,
    private messageService: MessageService,
    private router: Router,
    private ref:DynamicDialogConfig,
    private productDTO:ProductDataTransferService
  ) {}

  ngOnInit() {
    this.productAction = this.ref?.data;
    if(this.productAction.event.action === this.editProductAction 
      && this.productAction.productDatas) {
        this.getProductSelectedDatas(this.productAction?.event?.id as number)
    }

    if(this.productAction?.event?.action === this.saleProductAction) {
      this.getProductDatas();
    }
    this.getAllCategories();
    this.setCategoriesOnForms(this.categorySelected)
  }

  getAllCategories() {
    this.categoryService.getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.categoriesDatas = response;
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro.',
            detail: 'Erro ao buscar categorias',
            life: 2500
          });
        }
      });
  }

  onCategoryChange(category: any) {
    this.categoryService.findById(category)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.categorySelected = response;
            this.setCategoriesOnForms(this.categorySelected);
          }
        },
        error: (err) => {
          console.log(err);
        }
      });
  }
  
 setCategoriesOnForms(categorySelected: GetCategoriesResponse): void {
  const categoryFormGroup = this.addProductForm.get('category') as FormGroup;
  if (categorySelected) {
    categoryFormGroup.get('categoryId')?.setValue(categorySelected.categoryId);
    categoryFormGroup.get('name')?.setValue(categorySelected.name);
  }
}

  handleSubmitAddProduct(): void {
    if (this.addProductForm.valid) {
      this.productService.createProduct(this.addProductForm.value as CreateProductRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso!',
                detail: 'Produto criado com sucesso',
                life: 2500
              });
            }
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar produto',
              life: 2500
            });
          }
        });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, preencha todos os campos corretamente',
        life: 2500
      });
    }
    this.addProductForm.reset();
  }

  handleSubmitEditProduct():void {
    if (this.editProductForm.value && this.editProductForm.valid && this.productAction?.event?.id) {
      const requestEditProduct:EditProductRequest = {
        product_id: this.productAction?.event.id,
        name: this.editProductForm?.value?.name as string,
        price: this.editProductForm?.value?.price as number,
        description: this.editProductForm?.value?.description as string,
        amount: this.editProductForm?.value?.amount as number
      }

      this.productService.editProduct(requestEditProduct)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next:() => {
          this.messageService.add({
            severity:'success',
            summary:'Sucesso.',
            detail:'Produto editado com sucesso!',
            life:2500
          })
          this.editProductForm.reset();
        },
        error:(err) => {
          console.log(err)
          this.messageService.add({
            severity:'error',
            summary:'Erro.',
            detail:'Erro ao editar produto',
            life:2500
          })
          this.editProductForm.reset();
        }
      })
    }
  }

  handleSubmitSaleProduct() {
    if(this.saleProductForm?.value && this.saleProductForm?.valid) {
      const requestDatas:SaleProductRequest = {
        productId: this.saleProductForm?.value?.productId as number,
        quantitySold: this.saleProductForm?.value?.quantitySold as number
      }

      this.productService.saleProduct(requestDatas)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next:() => {
          this.messageService.add({
            severity:'success',
            summary:'Sucesso',
            detail:'Venda efetuada com sucesso',
            life:2500
          });
          this.saleProductForm.reset();
          this.getProductDatas();
          this.router.navigate(['/dashboard'])
        },
        error:(err) => {
          this.messageService.add({
            severity:'error',
            summary:'Erro',
            detail:'Erro ao evetuar a venda do produto',
            life:2500
          });
          this.saleProductForm.reset();
          console.log(err)
        }
      })
    }
  }
  
  getProductSelectedDatas(product_id: number): void {
    const allProducts = this.productAction?.productDatas;
    if (allProducts && allProducts.length > 0) {
      const productFiltered = allProducts.find((element) => element.id === product_id);
      if (productFiltered) {
        this.productSelectedDatas = productFiltered;
  
        this.editProductForm.patchValue({
          name: this.productSelectedDatas.name,
          price: this.productSelectedDatas.price,
          description: this.productSelectedDatas.description,
          amount: this.productSelectedDatas.amount
        });
      }
    }
  }
  
  getProductDatas():void {
    this.productService.getAllProducts()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next:(response) => {
        if(response.length > 0) {
          this.productDatas = response
          this.productDatas && this.productDTO.setProductsDatas(this.productDatas);
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}