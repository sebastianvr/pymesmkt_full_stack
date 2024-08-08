import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { ViewGraphComponent } from './pages/view-graph/view-graph.component';
import { NewReportComponent } from './pages/new-report/new-report.component';
import { ViewUsersComponent } from './pages/view-users/view-users.component';
import { ViewDeletedUsersComponent } from './pages/view-deleted-users/view-deleted-users.component';
import { ViewSuspendedUsersComponent } from './pages/view-suspended-users/view-suspended-users.component';
import { FinishedReportsComponent } from './pages/finished-reports/finished-reports.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'view-graph', component: ViewGraphComponent },
      // { path: 'my-profile', component: MyProfileComponent },
      { path: 'view-users', component: ViewUsersComponent },
      { path: 'view-deleted-users', component: ViewDeletedUsersComponent },
      { path: 'view-suspended-users', component: ViewSuspendedUsersComponent },
      { path: 'new-reports', component: NewReportComponent },
      { path: 'finished-reports', component: FinishedReportsComponent },
      { path: '**', redirectTo: 'view-graph' }
    ],
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule { }
