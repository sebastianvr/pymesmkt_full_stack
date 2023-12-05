import { Component, Input, OnInit } from '@angular/core';
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

  @Input() nameUser!: string

  constructor() { }

  ngOnInit(): void {

    this.itemsPanelMenu = [
      {
        label: 'Colaboraciones',
        icon: 'pi pi-fw pi-share-alt',
        routerLink: '/admin/view-graph'
      },
      {
        label: 'Usuarios',
        icon: 'pi pi-users',
        items: [
          {
            label: 'Usuarios activos',
            icon: 'pi pi-fw pi-users',
            routerLink: '/admin/view-users',
          },
          {
            label: 'Usuarios suspendidos',
            icon: 'pi pi-fw pi-ban',
            routerLink: '/admin/view-suspended-users',
          },
          {
            label: 'Usuarios eliminados',
            icon: 'pi pi-fw pi-trash',
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
      }
    ]
  }
}