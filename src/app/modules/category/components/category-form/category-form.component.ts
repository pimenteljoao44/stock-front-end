import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { CategoryEvent } from 'src/app/models/enums/category/CategoryEvent';
import { CreateCategoryRequest } from 'src/app/models/interfaces/categories/request/CreateCategoryRequest';
import { EditCategorieRequest } from 'src/app/models/interfaces/categories/request/EditCategorieRequest';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetCategoriesResponse';
import { EventAction } from 'src/app/models/interfaces/event/EventAction';
import { CategoryService } from 'src/app/services/category/category.service';
import { CategorieDataTransferService } from 'src/app/shared/services/category/categorie-data-transfer.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit,OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public categoriesDatas: Array<GetCategoriesResponse> = [];
  public categorySelected!: GetCategoriesResponse;
  public categoriesSelectedDatas!:GetCategoriesResponse;
  public categorytAction!:{
    event:EventAction,
    categoriesDatas:Array<GetCategoriesResponse>
  }

  public addCategorieForm = this.formBuilder.group({
    name:['',Validators.required]
  })

  public editCategorieForm = this.formBuilder.group({
    name:['',Validators.required]
  })

  public addCategorieAction = CategoryEvent.ADD_CATEGORY_EVNT;
  public editCategorieAction = CategoryEvent.EDIT_CATEGORY_EVENT;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private messageService: MessageService,
    private router: Router,
    private ref:DynamicDialogConfig,
    private categoryDTO:CategorieDataTransferService
  ) { }

  ngOnInit() {
    this.categorytAction = this.ref?.data;
    console.log(this.categorytAction)
    console.log(this.categorytAction.categoriesDatas)
    if(this.categorytAction.event.action === this.editCategorieAction
      && this.categorytAction.categoriesDatas
    ) {
      console.log('entrou aqui')
      this.getCategorieSelectedDatas(this.categorytAction?.event?.id as number)
    }
    this.getAllCategories();
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

  handleSubmitAddCategory(): void {
    if (this.addCategorieForm.valid) {
      this.categoryService.createCategorie(this.addCategorieForm.value as CreateCategoryRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso!',
                detail: 'Categoria Criada com sucesso',
                life: 2500
              });
            }
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar categoria',
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
    this.addCategorieForm.reset();
  }

  handleSubmitEditCategory():void {
    if(this.editCategorieForm.value && this.editCategorieForm.valid && this.categorytAction?.event?.id) {
      const requestEditCategorie:EditCategorieRequest = {
        categoryId: this.categorytAction?.event?.id as number,
        name: this.editCategorieForm?.value?.name as string
      }
      this.categoryService.updateCategorie(requestEditCategorie) 
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next:() => {
          this.messageService.add({
            severity:'success',
            summary:'Sucesso',
            detail:'Categoria editada  com sucesso',
            life:2500
          });
          this.editCategorieForm.reset();       
        },
        error:(err) => {
          console.log(err)
          this.messageService.add({
            severity:'error',
            summary:'Erro',
            detail:'Erro ao editar Categoria',
            life:2500
          })
          this.editCategorieForm.reset();
        }
      })
    }
  }

  getCategorieSelectedDatas(categorie_id:number) {
    const allCategories = this.categorytAction?.categoriesDatas;
    console.log(categorie_id)
    console.log(allCategories)
    if (allCategories && allCategories.length > 0) {
      const categorieFiltered = allCategories.find((element) => element.categoryId === categorie_id);
      if (categorieFiltered) {
        this.categoriesSelectedDatas = categorieFiltered;
  
        this.editCategorieForm.patchValue({
          name: this.categoriesSelectedDatas?.name as string
        });
      }
    }
  }

  getCategoriesDatas():void {
    this.categoryService.getAllCategories()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next:(response) => {
        if(response.length > 0) {
          this.categoriesDatas = response
          this.categoriesDatas && this.categoryDTO.setCategoriesDatas(this.categoriesDatas);
        }
      }
    })
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
