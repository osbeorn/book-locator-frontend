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
  maxLibraries = 10;
  totalLibraries: number;
  loadingLibraries = false;

  constructor(
    private libraryService: LibraryService
  ) {
  }

  ngOnInit(): void {
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
          filter += `${key}:${value.matchMode}:${value.value}`;
        });
      }

      if (event.sortField) {
        order = `${event.sortField}`;

        if (event.sortOrder < 0) {
          order += ' DESC';
        }
      }

      offset = event.first;
      limit = event.rows;
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
