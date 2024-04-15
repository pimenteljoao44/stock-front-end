import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetCategoriesResponse';
import { EventAction } from 'src/app/models/interfaces/event/EventAction';
import { CategoryService } from 'src/app/services/category/category.service';
import { CategoryFormComponent } from '../../components/category-form/category-form.component';

@Component({
  selector: 'app-category-home',
  templateUrl: './category-home.component.html',
  styleUrls: ['./category-home.component.css']
})
export class CategoryHomeComponent implements OnInit,OnDestroy {
private readonly destroy$:Subject<void> = new Subject();
public categoriesDatas:Array<GetCategoriesResponse> = [];
isLoading: boolean = false;

private ref!:DynamicDialogRef;
  constructor(
    private categoriesService:CategoryService,
    private dialogService:DialogService,
    private messageService:MessageService,
    private confirmationService:ConfirmationService,
    private router:Router
  ) { }

  ngOnInit() {
    this.getAllCategories();
  }

  getAPICategoriesDatas() {
    this.isLoading = true;
    this.categoriesService.getAllCategories()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next:(response) => {
        if(response.length > 0) {
          this.categoriesDatas = response
          this.isLoading = false;
        }
      },
      error:(err) => {
        console.log(err)
        this.router.navigate(['/dashboard'])
        this.messageService.add({
          severity:'error',
          summary:'Erro.',
          detail:'Erro ao buscar categorias.',
          life:2000
        })
        this.isLoading = false;
      }
    })
  }


  getAllCategories(){
    this.isLoading = true;
    this.categoriesService.getAllCategories()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next:(response) => {
        if(response.length > 0){
          this.categoriesDatas = response;
          this.isLoading = false;
        }
      },
      error:(err) => {
        console.log(err)
        this.messageService.add({
          severity:'error',
          summary:'Erro.',
          detail:'Erro ao buscar categorias',
          life:2500
        })
        this.router.navigate(['/dashboard'])
        this.isLoading = false;
      }
    })
  }

  handleCategoryAction(event:EventAction):void {
    if(event) {
      console.log(event)
      this.ref = this.dialogService.open(CategoryFormComponent,{
        header:event?.action,
        width:'70%',
        contentStyle:{overFlow:'auto'},
        baseZIndex:10000,
        maximizable:true,
        data:{
          event:event,
          categoriesDatas:this.categoriesDatas
        }
      })
      this.ref.onClose
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.getAPICategoriesDatas()
      })
    }
  }

  handleDeleteCategorieAction(event:{categorie_id:number,categorie_name:string}):void {
    if(event) {
      this.confirmationService.confirm({
        message:`Confirma a exclusão da categoria ${event?.categorie_name}?`,
        header:'Confirmação de exclusão',
        icon:'pi pi-exclamation-triangle',
        acceptLabel:'Sim',
        rejectLabel:'Não',
        accept: () => this.deleteCategory(event?.categorie_id)
      })
    }
  }

  deleteCategory(cateegorie_id:number){
    this.categoriesService.deleteCategorie(cateegorie_id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next:(response) => {
        this.getAPICategoriesDatas();
        this.messageService.add({
          severity:'success',
          summary:'Sucesso',
          detail:'Categoria removida com sucesso',
          life:2500
        })
      },
      error:(err) => {
        console.log(err)
        this.messageService.add({
          severity:'error',
          summary:'Erro',
          detail:'Erro ao deletar a categoria',
          life:2500
        })
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
