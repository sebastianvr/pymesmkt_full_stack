import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ModalOfferDetailComponent } from '../modal-offer-detail/modal-offer-detail.component';
import { PublicacionService } from 'src/app/core/services/publicacion/publicacion.service';
import { SearchPublicationComponent } from '../search-publication/search-publication.component';

@Component({
  selector: 'app-post-card-pyme',
  templateUrl: './post-card-pyme.component.html',
  styleUrls: ['./post-card-pyme.component.css'],
})
export class PostCardPymeComponent implements OnInit, OnChanges {
  @ViewChild(SearchPublicationComponent) searchPublicationComponent!: SearchPublicationComponent;
  @Input() filters: any;
  @Output() clearFiltersEvent = new EventEmitter<void>();

  publicaciones: any;
  currentPage!: number;
  page: number = 1;
  pageSize: number = 10;
  total!: number;
  totalPages!: number;
  isLoading: boolean = true;
  noSearchMatch!: boolean;
  isEmptyPublications!: boolean;

  offerForm!: FormGroup;
  idUser: string = this.authService.usuario.id;
  closeResult!: string;

  garantiaMapa = {
    'true': 'Si',
    'false': 'No',
  };
  currentFilter: any;

  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private publicacionService: PublicacionService,
  ) { }

  ngOnInit(): void {
    const query = {
      page: this.page,
      pageSize: this.pageSize,
    };

    this.getQueryPublications(query);
  }

  public getQueryPublications(filters: any) {
    this.isLoading = true;
    // console.log({ filters });
    this.publicacionService.getQueryPublications(filters)
      .subscribe((data) => {
        // console.log({ data });
        this.isLoading = false;

        if (data.noSearchMatch) {
          this.noSearchMatch = true;
          this.isEmptyPublications = false;
        } else {
          const {
            publicaciones,
            total,
            currentPage,
            pageSize,
            totalPages,
          } = data;


          if (publicaciones.length === 0) {
            this.isEmptyPublications = true;
            this.noSearchMatch = false;
          } else {
            this.isEmptyPublications = false;
            this.total = total;
            this.currentPage = currentPage;
            this.pageSize = pageSize;
            this.totalPages = totalPages;
            this.publicaciones = publicaciones;
            this.noSearchMatch = false;
          }
        }

        this.isLoading = false;
      });
  }

  public isEqualIds(itemId: string): boolean {
    return this.idUser === itemId ?
      true : false;
  }

  public async openOffer(offer: any) {
    // console.log({ offer });
    const modalRef = this.modalService.open(ModalOfferDetailComponent, { size: 'lg' });
    modalRef.componentInstance.idOffer = offer.id;
    modalRef.componentInstance.senderUserId = this.idUser;
    modalRef.componentInstance.recipientdUserId = offer.UsuarioId;

    const result = await modalRef.result;
    if (result) {
      // console.log({ result });
      this.closeResult = `Closed with: ${result}`;
    }
  }

  public clearFilter() {
    this.currentFilter = null;
    const query = {
      page: 1,
      pageSize: this.pageSize,
    };
    this.getQueryPublications(query);

    // Emite el evento para limpiar filtros
    this.clearFiltersEvent.emit();
  }

  public onFormFilter0Submitted(filters: any) {
    this.currentFilter = filters;
    this.getQueryPublications(filters);
  }

  public onFormFilter1Submitted(filters: any) {
    this.currentFilter = filters;
    this.getQueryPublications(filters);
  }

  public onPageChange(newPage: number) {
    // console.log('onPageChange()');
    // console.log(this.currentFilter);
    if (this.currentFilter) {
      const query = {
        page: newPage,
        pageSize: this.pageSize,
        // Agrega los filtros del formulario actual a la consulta
        ...this.currentFilter,
      };
      // console.log(this.currentFilter);
      this.getQueryPublications(query);
    } else {
      this.currentFilter = null;
      // Si no hay filtro actual, simplemente cambia de página sin filtros adicionales.
      const query = {
        page: newPage,
        pageSize: this.pageSize,
      };
      this.getQueryPublications(query);
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters']) {
      if (changes['filters'].currentValue !== undefined &&
        changes['filters'].currentValue !== null) {
        this.currentFilter = changes['filters'].currentValue;
      } else {
        this.currentFilter = null;
      }

      const query = {
        page: this.page,
        pageSize: this.pageSize,
        ...this.currentFilter,
      };
      this.getQueryPublications(query);
    }
  }
}
