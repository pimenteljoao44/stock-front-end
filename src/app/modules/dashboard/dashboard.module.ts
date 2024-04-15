import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DASHBOARD_ROUTES } from './dashboard.routing';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import {ToolbarModule} from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import {ChartModule} from 'primeng/chart';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardHomeComponent } from './page/dashboard-home/dashboard-home.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
  declarations:[DashboardHomeComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(DASHBOARD_ROUTES),
    SidebarModule,
    ButtonModule,
    ToolbarModule,
    CardModule,
    ToastModule,
    ChartModule,
    SharedModule,
    ProgressSpinnerModule
  ],
  providers: [CookieService,MessageService],
})
export class DashboardModule { }
