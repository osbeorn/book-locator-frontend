import {Component, OnInit, ViewChild} from '@angular/core';
import {Library} from '../../../../../models/library.model';
import {Table} from 'primeng/table';
import {Floor} from '../../../../../models/floor.model';
import {ActivatedRoute, Router} from '@angular/router';
import {LibraryService} from '../../../../../services/library.service';
import {LazyLoadEvent} from 'primeng/api';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  @ViewChild('dt', { static: true }) table: Table;

  id: string;

  library: Library = {};

  floors: Floor[];
  maxFloors;
  totalFloors: number;
  loadingFloors: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private libraryService: LibraryService
  ) {
  }

  ngOnInit(): void {
    console.log('ngOnInit');

    this.maxFloors = 20;
    this.loadingFloors = true;

    this.route.paramMap.subscribe(p => {
      if (p.has('libraryId')) {
        this.id = p.get('libraryId');

        this.libraryService.getLibrary(this.id)
          .subscribe(res => this.library = res);
      }
    });
  }

  loadFloors(event?: LazyLoadEvent): void {
    console.log('loadFloors');
    console.log(event);

    const fields = 'id,code,name';
    let filter = '';
    let order = '';
    let offset = 0;
    let limit: number = this.maxFloors;

    console.log('limit: ' + this.maxFloors);

    this.loadingFloors = true;

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

    console.log('offset:' + offset);
    console.log('limit:' + limit);

    this.libraryService.getLibraryFloors(this.id, fields, filter, order, offset, limit)
      .pipe(
        finalize(() => this.loadingFloors = false)
      )
      .subscribe(res => {
        this.floors = res.body;
        this.totalFloors = +res.headers.get('x-total-count');
      });
  }

  confirmDeleteLibrary(): void {

  }
}
