import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrimeNgModule } from '../shared/modules/prime-ng/prime-ng.module';

import { HomeComponent } from './pages/home/home.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import { CreatePublicationComponent } from './pages/create-publication/create-publication.component';
import { PublicationDetailComponent } from './pages/publication-detail/publication-detail.component';
import { OffersReceivedComponent } from './pages/offers-received/offers-received.component';
import { OffersMadeComponent } from './pages/offers-made/offers-made.component';
import { PurchasesComponent } from './pages/purchases/purchases.component';
import { SalesComponent } from './pages/sales/sales.component';
import { SeePublicationsComponent } from './pages/see-publications/see-publications.component';
import { UserRoutingModule } from './user-routing.module';
import { NavbarPymeComponent } from './components/navbar-pyme/navbar-pyme.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarUserComponent } from './components/sidebar-user/sidebar-user.component';
import { ReactiveFormsModule } from '@angular/forms';

import { SearchPublicationComponent } from './components/search-publication/search-publication.component';
import { PostCardPymeComponent } from './components/post-card-pyme/post-card-pyme.component';
import { MainComponent } from './pages/main/main.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { OfferDetailComponent } from './pages/offer-detail/offer-detail.component';
import { FilterPublicationComponent } from './components/filter-publication/filter-publication.component';
import { ModalOfferDetailComponent } from './components/modal-offer-detail/modal-offer-detail.component';
import { VendorQualificationFormComponent } from './pages/purchases/components/vendor-qualification-form/vendor-qualification-form.component';
import { ReportProblemFormComponent } from './pages/purchases/components/report-problem-form/report-problem-form.component';


const components = [
  HomeComponent,
  MyProfileComponent,
  CreatePublicationComponent,
  PublicationDetailComponent,
  OffersReceivedComponent,
  OffersMadeComponent,
  PurchasesComponent,
  SalesComponent,
  SeePublicationsComponent,
  NavbarPymeComponent,
  FooterComponent,
  SidebarUserComponent,
  SearchPublicationComponent,
  PostCardPymeComponent,
  MainComponent,
  OfferDetailComponent,
  FilterPublicationComponent,
  ModalOfferDetailComponent,
  VendorQualificationFormComponent,
  ReportProblemFormComponent
]

@NgModule({
  declarations: [
    ...components,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    PrimeNgModule,
    NgbModule,
  ],
  providers: [
    MessageService
  ]
})
export class UserModule { }
