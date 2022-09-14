import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './pages/main/main.component';
import { HomeComponent } from './pages/home/home.component';
import { ViewGraphComponent } from './pages/view-graph/view-graph.component';
import { NavbarAdminComponent } from './components/navbar-admin/navbar-admin.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarAdminComponent } from './components/sidebar-admin/sidebar-admin.component';
import { PrimeNgModule } from '../shared/modules/prime-ng/prime-ng.module';
import { AdminRoutingModule } from './admin-routing.module';
import { SigmaComponent } from './components/sigma/sigma.component';
import { GraphComponent } from './components/graph/graph.component';



@NgModule({
  declarations: [
    MainComponent,
    HomeComponent,
    ViewGraphComponent,
    NavbarAdminComponent,
    FooterComponent,
    SidebarAdminComponent,
    SigmaComponent,
    GraphComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    PrimeNgModule
  ]
})
export class AdminModule { }
