import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Injectable} from '@angular/core';
import {SearchLog} from '../models/search-log.model';

@Injectable()
export class SearchLogService {

  private url = `${environment.bookLocatorService.url}/search-logs`;

  constructor(
    private http: HttpClient
  ) {
  }

  public getSearchLogs(fields: string = '', filter: string = '', order: string = '', offset = 0, limit = 0): Observable<HttpResponse<SearchLog[]>> {
    const params: any = {
      fields,
      filter,
      order,
      offset,
      limit
    };

    return this.http.get<SearchLog[]>(`${this.url}`, { observe: 'response', params });
  }
}
