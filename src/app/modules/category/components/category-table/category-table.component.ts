import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Action } from 'rxjs/internal/scheduler/Action';
import { CategoryEvent } from 'src/app/models/enums/category/CategoryEvent';
import { DeleteCategoryAction } from 'src/app/models/interfaces/categories/event/DeleteCategoryAction';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetCategoriesResponse';
import { EventAction } from 'src/app/models/interfaces/event/EventAction';

@Component({
  selector: 'app-category-table',
  templateUrl: './category-table.component.html',
  styleUrls: ['./category-table.component.css']
})
export class CategoryTableComponent implements OnInit {
public addCategoryEvent = CategoryEvent.ADD_CATEGORY_EVNT;
public editCategoryEvent = CategoryEvent.EDIT_CATEGORY_EVENT;
public categorieSelected!:GetCategoriesResponse;
@Input() public categories:Array<GetCategoriesResponse> = [];
@Output() categoryEvent = new EventEmitter<EventAction>();
@Output() deleteCategoryEvent = new EventEmitter<DeleteCategoryAction>();
  constructor() { }

  handleCategoryEvent(action:string,id?:number) {
    if(action && action !== '') {
      const categoryEventData = id && id !== null? {action,id} : {action};
      this.categoryEvent.emit(categoryEventData)
    }
  }

  handleDeleteCategory(categorie_id:number,categorie_name:string):void {
    if (categorie_id !== null && categorie_name !== '') {
      this.deleteCategoryEvent.emit({categorie_id,categorie_name})
    }
  }

  ngOnInit() {
  }

}
