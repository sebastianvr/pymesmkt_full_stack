import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { CreatePublicationComponent } from './pages/create-publication/create-publication.component';
import { SeePublicationsComponent } from './pages/see-publications/see-publications.component';
import { PublicationDetailComponent } from './pages/publication-detail/publication-detail.component';
import { OffersReceivedComponent } from './pages/offers-received/offers-received.component';
import { OffersMadeComponent } from './pages/offers-made/offers-made.component';
import { PurchasesComponent } from './pages/purchases/purchases.component';
import { SalesComponent } from './pages/sales/sales.component';
import { MainComponent } from './pages/main/main.component';



const routes: Routes = [

  {
    path: '',
    component: MainComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'my-profile', component: MyProfileComponent },
      { path: 'create-publication', component: CreatePublicationComponent },
      { path: 'see-publications', component: SeePublicationsComponent },
      { path: 'publication-detail/:id', component: PublicationDetailComponent },
      { path: 'offers-received', component: OffersReceivedComponent },
      { path: 'offers-made', component: OffersMadeComponent },
      { path: 'purchases', component: PurchasesComponent },
      { path: 'sales', component: SalesComponent },
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
export class UserRoutingModule { }
