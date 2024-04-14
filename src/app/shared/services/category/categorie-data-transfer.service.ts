import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetCategoriesResponse';

@Injectable({
  providedIn: 'root'
})
export class CategorieDataTransferService {

constructor() { }
public categoriesDataEmitter$ = new BehaviorSubject<Array<GetCategoriesResponse> | null>(null);

public categoriesDatas:Array<GetCategoriesResponse> = [];

setCategoriesDatas(categories:Array<GetCategoriesResponse>):void {
  if(categories) {
    this.categoriesDataEmitter$.next(categories)
    this.getProductsDatas();
  }
}

getProductsDatas() {
  this.categoriesDataEmitter$.pipe(
    take(1)
  )
  .subscribe({
    next:(response) => {
      if(response) {
        this.categoriesDatas = response
      }
    }
  })
  return this.categoriesDatas;
}
}
