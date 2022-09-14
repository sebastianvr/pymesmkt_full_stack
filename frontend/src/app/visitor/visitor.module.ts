import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitorRoutingModule } from './visitor-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { NavbarVisitorComponent } from './components/navbar-visitor/navbar-visitor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './components/footer/footer.component';
import { MainComponent } from './pages/main/main.component';
import { PostCardVisitorComponent } from './components/post-card-visitor/post-card-visitor.component';
import { SearchPublicationComponent } from './components/search-publication/search-publication.component';
import { MessageService } from 'primeng/api';
import { PrimeNgModule } from '../shared/modules/prime-ng/prime-ng.module';


const components: any[] = [
  HomeComponent,
  LoginComponent,
  RegisterComponent,
  NavbarVisitorComponent,
  FooterComponent,
  MainComponent,
  PostCardVisitorComponent,
  SearchPublicationComponent,
]

@NgModule({
  declarations: [
    ...components,
  ],
  imports: [
    CommonModule,
    VisitorRoutingModule,
    ReactiveFormsModule,
    PrimeNgModule
  ]
})
export class VisitorModule { }
