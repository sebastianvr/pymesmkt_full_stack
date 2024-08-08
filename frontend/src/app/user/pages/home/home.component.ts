import { Component, ViewChild } from '@angular/core';
import { SearchPublicationComponent } from '../../components/search-publication/search-publication.component';
import { PostCardPymeComponent } from '../../components/post-card-pyme/post-card-pyme.component';
import { FilterPublicationComponent } from '../../components/filter-publication/filter-publication.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  filters: any;
  @ViewChild(SearchPublicationComponent)
  searchPublicationComponent!: SearchPublicationComponent;

  @ViewChild(PostCardPymeComponent)
  postCardPymeComponent!: PostCardPymeComponent;

  @ViewChild(FilterPublicationComponent)
  filterPublicationComponent!: FilterPublicationComponent;

  constructor() { }

  // Actualiza los filtros y pasa los nuevos filtros al componente hijo
  public onFormFilter0Submitted(filters: any) {
    this.filters = filters;
  }

  // Actualiza los filtros y pasa los nuevos filtros al componente hijo
  public onFormFilter1Submitted(filters: any) {
    this.filters = filters;
  }

  clearFilters() {
    this.filters = null;
    this.searchPublicationComponent.clearForm();
    this.filterPublicationComponent.clearForm();
    const query = {
      page: 1,
      pageSize: 10,
    };
    this.postCardPymeComponent.getQueryPublications(query);
  }

  handleClearFiltersEvent() {
    this.clearFilters();
  }
}