import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryHomeComponent } from './page/category-home/category-home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CATEGORY_ROUTES } from './category.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService } from 'primeng/api';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { CategoryTableComponent } from './components/category-table/category-table.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(CATEGORY_ROUTES),
    SharedModule,
    HttpClientModule,
    CardModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextareaModule,
    InputNumberModule,
    DynamicDialogModule,
    DropdownModule,
    ConfirmDialogModule,
    TooltipModule,
    ProgressSpinnerModule
  ],
  declarations: [CategoryHomeComponent,CategoryFormComponent,CategoryTableComponent],
  providers:[DialogService,ConfirmationService]
})
export class CategoryModule { }
