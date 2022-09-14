import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { threadId } from 'worker_threads';

@Component({
  selector: 'app-sidebar-user',
  templateUrl: './sidebar-user.component.html',
  styleUrls: ['./sidebar-user.component.css']
})
export class SidebarUserComponent implements OnInit {

  display!: boolean;
  visibleSidebar: boolean = true;
  itemsPanelMenu: MenuItem[] = [];
  
  

  constructor(
    private primengConfig: PrimeNGConfig
  ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;

    this.itemsPanelMenu = [
        {
            label: 'Inicio',
            icon: 'pi pi-home',
            routerLink: '/user',
            // command : (event : any ) =>{
            //     console.log(event)

            // }

        },
        {
            label: 'Publicaciones',
            icon: 'pi pi-book',
            items: [
                {
                    label: 'Crear una publicación',
                    icon: 'pi pi-fw pi-pencil',
                    routerLink: '/user/create-publication'
                },
                {
                    label: 'Ver mis publicaciones',
                    icon: 'pi pi-fw pi-eye',
                    routerLink: '/user/see-publications'
                },
            ]
        },
        {
            label: 'Ofertas',
            icon: 'pi pi-fw pi-dollar',
            items: [
                {
                    label: 'Ofertas recibidas',
                    icon: 'pi pi-fw pi-directions-alt',
                    routerLink: '/user/offers-received'
                },
                {
                    label: 'Ofertas realizadas',
                    icon: 'pi pi-fw pi-directions',
                    routerLink: '/user/offers-made'
                },
            ]
        },
        {
            label: 'Compras',
            icon: 'pi pi-fw pi-shopping-cart',
            routerLink: '/user/purchases'
        },
        {
            label: 'Ventas',
            icon: 'pi pi-fw pi-wallet',
            routerLink: '/user/sales'
        }
    ]
  }

  ocultar(){
    // this.itemsPanelMenu.
  }

}
