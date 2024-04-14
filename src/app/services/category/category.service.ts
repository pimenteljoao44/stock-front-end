import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { CreateCategoryRequest } from 'src/app/models/interfaces/categories/request/CreateCategoryRequest';
import { EditCategorieRequest } from 'src/app/models/interfaces/categories/request/EditCategorieRequest';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/responses/GetCategoriesResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookieService.get('USER_INFO');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.JWT_TOKEN}`,
    }),
  }; 

constructor(
  private http:HttpClient,
  private cookieService:CookieService
) { }

findById(category_id:any):Observable<GetCategoriesResponse> {
  return this.http.get<GetCategoriesResponse>(
    `${this.API_URL}/category/${category_id}`,
    this.httpOptions
  );
}

getAllCategories():Observable<Array<GetCategoriesResponse>> {
  return this.http.get<Array<GetCategoriesResponse>>(
    `${this.API_URL}/category`,
    this.httpOptions
  ) 
}

createCategorie(requestDatas:CreateCategoryRequest):Observable<GetCategoriesResponse>{
  return this.http.post<GetCategoriesResponse>(
    `${this.API_URL}/category`,
    requestDatas,
    this.httpOptions
  )
}

updateCategorie(requestDatas:EditCategorieRequest):Observable<void> {
  return this.http.put<void>(
    `${this.API_URL}/category/${requestDatas.categoryId}`,
    requestDatas,
    this.httpOptions
  )
}

deleteCategorie(categorie_id:number):Observable<void> {
  return  this.http.delete<void>(
    `${this.API_URL}/category/${categorie_id}`,
    this.httpOptions
  )

}

}
