import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar-admin',
  templateUrl: './sidebar-admin.component.html',
  styleUrls: ['./sidebar-admin.component.css']
})
export class SidebarAdminComponent implements OnInit {

  display!: boolean;
  visibleSidebar: boolean = true;
  itemsPanelMenu: MenuItem[] = [];

  constructor() { }

  ngOnInit(): void {

    this.itemsPanelMenu = [
      {
        label: 'Buscar empresa',
        icon: 'pi pi-fw pi-search',
      },
      {
        label: 'Reclamos',
        icon: 'pi pi-book',
        items: [
          {
            label: 'Reclamos nuevos',
            icon: 'pi pi-fw pi-user-plus',
            routerLink: '/admin/new-report',
          },
          {
            label: 'Reclamos finalizados',
            icon: 'pi pi-fw pi-user-minus',
          },
        ]
      },
      {
        label: 'Colaboraciones',
        icon: 'pi pi-fw pi-share-alt',
        routerLink: '/admin/view-graph'
      }
    ]
  }


}
