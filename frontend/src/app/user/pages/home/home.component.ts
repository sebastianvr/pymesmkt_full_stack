import { Component, OnInit, ViewChild } from '@angular/core';
import { PublicacionService } from 'src/app/core/services/publicacion/publicacion.service';
import { SearchPublicationComponent } from '../../components/search-publication/search-publication.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  publicaciones: any;
  currentPage!: number;

  page: number = 1;
  pageSize: number = 10;
  total!: number;
  totalPages!: number;

  isLoading: boolean = true;

  currentFilter: any;
  @ViewChild(SearchPublicationComponent) searchPublicationComponent!: SearchPublicationComponent;

  constructor(
    private publicacionService: PublicacionService,
  ) { }

  ngOnInit(): void {
    const query = {
      page: this.page,
      pageSize: this.pageSize,
    };

    this.getQueryPublications(query);
  }

  getQueryPublications(filters: any) {
    this.isLoading = true;
    this.publicacionService.getQueryPublications(filters)
      .subscribe(data => {
        // console.log({ data });
        const {
          publicaciones,
          total,
          currentPage,
          pageSize,
          totalPages,
        } = data;

        this.publicaciones = publicaciones;
        this.total = total;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.totalPages = totalPages;

        this.isLoading = false;

        // console.log('this.publicaciones', this.publicaciones);
        // console.log('this.total', this.total);
        // console.log('this.currentPage', this.currentPage);
        // console.log('this.pageSize', this.pageSize);
        // console.log('this.totalPages', this.totalPages);
        // console.log('this.isLoading', this.isLoading);
      });
  }

  onFormFilter0Submitted(filters: any) {
    // console.log('onFormFilter0Submitted()');
    // console.log({ filters });
    this.currentFilter = filters;
    this.getQueryPublications(filters);
  }

  onFormFilter1Submitted(filters: any) {
    // console.log('onFormFilter1Submitted()');
    // console.log({ filters });
    this.currentFilter = filters;
    this.getQueryPublications(filters);
  }

  onPageChange(newPage: number) {
    if (this.currentFilter) {
      const query = {
        page: newPage,
        pageSize: this.pageSize,
        // Agrega los filtros del formulario actual a la consulta
        ...this.currentFilter,
      };

      this.getQueryPublications(query);
    } else {
      // Si no hay filtro actual, simplemente cambia de página sin filtros adicionales.
      const query = {
        page: newPage,
        pageSize: this.pageSize,
      };
      this.getQueryPublications(query);
    }
  }

  clearFilter() {
    this.searchPublicationComponent.clearForm();
    this.currentFilter = null;
    const query = {
      page: 1,
      pageSize: this.pageSize,
    };
    this.getQueryPublications(query);
  }
}
