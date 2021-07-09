import {Component, OnInit, ViewChild} from '@angular/core';
import {Table} from 'primeng/table';
import {Library} from '../../../../models/library.model';
import {LibraryService} from '../../../../services/library.service';
import {LazyLoadEvent} from 'primeng/api';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @ViewChild('dt') table: Table;

  libraries: Library[];
  maxLibraries;
  totalLibraries: number;
  loadingLibraries: boolean;

  constructor(
    private libraryService: LibraryService
  ) {
  }

  ngOnInit(): void {
    this.maxLibraries = 20;
    this.loadingLibraries = true;
  }

  loadLibraries(event?: LazyLoadEvent): void {
    const fields = 'id,code,name';
    let filter = '';
    let order = '';
    let offset = 0;
    let limit: number = this.maxLibraries;

    this.loadingLibraries = true;

    if (event) {
      if (event.filters) {
        Object.entries(event.filters).forEach(([key, value]) => {
          let filterValue;

          switch (value.matchMode) {
            case 'LIKE':
            case 'LIKEIC':
              filterValue = `%${value.value}%`;
              break;
            default:
              filterValue = value.value;
          }

          filter += `${key}:${value.matchMode}:${filterValue} `;
        });
        filter = filter.trim();
      }

      if (event.sortField) {
        order = `${event.sortField}`;

        if (event.sortOrder < 0) {
          order += ' DESC';
        }
      }

      if (event.first) {
        offset = event.first;
      }
      if (event.rows) {
        limit = event.rows;
      }
    }

    this.libraryService.getLibraries(fields, filter, order, offset, limit)
      .pipe(
        finalize(() => this.loadingLibraries = false)
      )
      .subscribe(res => {
        this.libraries = res.body;
        this.totalLibraries = +res.headers.get('x-total-count');
      });
  }
}
