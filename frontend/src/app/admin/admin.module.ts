import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { ViewSuspendedUsersComponent } from './pages/view-suspended-users/view-suspended-users.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalHelpGraphComponent } from './components/modal-help-graph/modal-help-graph.component';
import { SimulationModalComponent } from './components/simulation-modal/simulation-modal.component';
import { SimulationResultModalComponent } from './components/simulation-result-modal/simulation-result-modal.component';
import { ModalArchivingComponent } from './components/modal-archiving/modal-archiving.component';
import { ModalDetailReportComponent } from './components/modal-detail-report/modal-detail-report.component';
import { FinishedReportsComponent } from './pages/finished-reports/finished-reports.component';



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
    ViewSuspendedUsersComponent,
    ModalHelpGraphComponent,
    SimulationModalComponent,
    SimulationResultModalComponent,
    ModalArchivingComponent,
    ModalDetailReportComponent,
    FinishedReportsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    PrimeNgModule,
    NgbModule,
  ]
})
export class AdminModule { }
