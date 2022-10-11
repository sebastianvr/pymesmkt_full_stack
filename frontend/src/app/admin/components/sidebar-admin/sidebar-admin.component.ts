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
        label: 'Usuarios',
        icon: 'pi pi-users',
        items: [
          {
            label: 'Usuarios activos',
            icon: 'pi pi-fw pi-user-plus',
            routerLink: '/admin/view-users',
          },
          {
            label: 'Usuarios eliminados',
            icon: 'pi pi-fw pi-user-minus',
            routerLink: '/admin/view-deleted-users',
          },
        ]
      },
      {
        label: 'Reclamos',
        icon: 'pi pi-book',
        items: [
          {
            label: 'Reclamos nuevos',
            icon: 'pi pi-fw pi-bookmark',
            routerLink: '/admin/new-report',
          },
          {
            label: 'Reclamos finalizados',
            icon: 'pi pi-fw pi-bookmark-fill',
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
