import {Component, OnInit, ViewChild} from '@angular/core';
import {Table} from 'primeng/table';
import {LazyLoadEvent, SelectItem} from 'primeng/api';
import {finalize} from 'rxjs/operators';
import {SearchLog} from '../../../../models/search-log.model';
import {SearchLogService} from '../../../../services/search-log.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @ViewChild('dt') table: Table;

  searchLogs: SearchLog[];
  maxSearchLogs;
  totalSearchLogs: number;
  loadingSearchLogs: boolean;

  customDateMatchModeOptions: SelectItem[];

  constructor(
    private searchLogService: SearchLogService
  ) {
  }

  ngOnInit(): void {
    this.maxSearchLogs = 20;
    this.loadingSearchLogs = true;

    this.customDateMatchModeOptions = [
      {
        value: 'EQ', label: 'Je enako'
      }
    ];
  }

  loadSearchLogs(event?: LazyLoadEvent): void {
    console.log(event);

    const fields = '';
    let filter = '';
    let order = '';
    let offset = 0;
    let limit: number = this.maxSearchLogs;

    this.loadingSearchLogs = true;

    if (event) {
      if (event.filters) {
        Object.entries(event.filters).forEach(([key, value]) => {
          let filterValue;

          switch (value.matchMode) {
            case 'EQ':
              if (value.value instanceof Date) {
                const dateValue = value.value as Date;
                filterValue = `'${dateValue.toISOString()}'`;
              } else {
                filterValue = value.value;
              }
              break;
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

    this.searchLogService.getSearchLogs(fields, filter, order, offset, limit)
      .pipe(
        finalize(() => this.loadingSearchLogs = false)
      )
      .subscribe(res => {
        this.searchLogs = res.body;
        this.totalSearchLogs = +res.headers.get('x-total-count');
      });
  }
}
