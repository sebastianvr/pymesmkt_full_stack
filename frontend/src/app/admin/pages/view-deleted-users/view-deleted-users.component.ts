import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UsuarioService } from 'src/app/core/services/usuario/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-deleted-users',
  templateUrl: './view-deleted-users.component.html',
  styleUrls: ['./view-deleted-users.component.css']
})
export class ViewDeletedUsersComponent implements OnInit, OnDestroy {

  searchText: string = '';
  allUsuariosDeleted: any;
  suscription!: Subscription;

  pageSize: number = 20;
  page: number = 1;
  currentPage!: number;
  total!: number;
  totalPages!: number;

  isLoading: boolean = true;
  isEmptyUsers: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
  ) { }

  ngOnInit(): void {
    console.log('ngOnInit()');
    this.getAll(this.pageSize, this.page);

    this.suscription = this.usuarioService.refresh.subscribe((data) => {
      console.log({ data });
      this.getAll(this.pageSize, this.page);
    });
  }

  getAll(pageSize: number, page: number) {
    this.isLoading = true;

    this.usuarioService.getAllUsuariosDeleted(page, pageSize).subscribe((data) => {
      this.isLoading = false;
      console.log({ data });
      if (data.usuarios.length === 0) {
        this.isEmptyUsers = true;
      } else {
        const {
          usuarios,
          total,
          currentPage,
          pageSize,
          totalPages,
        } = data;

        this.allUsuariosDeleted = usuarios;
        this.total = total;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.totalPages = totalPages;

        this.isEmptyUsers = false;


        console.log(this.allUsuariosDeleted);
      }
    });
  }

  onPageChange(newPage: number) {
    console.log({newPage});
    this.getAll(this.pageSize, newPage);
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
    console.log('observable cerrado')
  }
}
