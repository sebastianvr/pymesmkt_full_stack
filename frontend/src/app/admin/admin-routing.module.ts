import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { HomeComponent } from './pages/home/home.component';
import { ViewGraphComponent } from './pages/view-graph/view-graph.component';

const routes: Routes = [

  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'view-graph', component: ViewGraphComponent },
      // { path: 'new-report', component:  },
      // { path: 'see-publications', component: SeePublicationsComponent },
      // { path: 'publication-detail', component: PublicationDetailComponent },
      // { path: 'offers-received', component: OffersReceivedComponent },
      // { path: 'offers-made', component: OffersMadeComponent },
      // { path: 'purchases', component: PurchasesComponent },
      // { path: 'sales', component: SalesComponent },
      { path: '**', redirectTo: 'home' }
    ]
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
