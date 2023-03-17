import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimeNgModule } from '../shared/modules/prime-ng/prime-ng.module';

import { SearchPipe } from '../core/pipes/search.pipe';

import { MainComponent } from './pages/main/main.component';
import { HomeComponent } from './pages/home/home.component';
import { ViewGraphComponent } from './pages/view-graph/view-graph.component';
import { NavbarAdminComponent } from './components/navbar-admin/navbar-admin.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarAdminComponent } from './components/sidebar-admin/sidebar-admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { NewReportComponent } from './pages/new-report/new-report.component';
import { ViewDeletedUsersComponent } from './pages/view-deleted-users/view-deleted-users.component';
import { ViewUsersComponent } from './pages/view-users/view-users.component';



@NgModule({
  declarations: [
    MainComponent,
    HomeComponent,
    ViewGraphComponent,
    NavbarAdminComponent,
    FooterComponent,
    SidebarAdminComponent,
    NewReportComponent,
    SearchPipe,
    ViewDeletedUsersComponent,
    ViewUsersComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    PrimeNgModule,
    FormsModule,
  ]
})
export class AdminModule { }
