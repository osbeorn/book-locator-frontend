import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Injectable} from '@angular/core';

@Injectable()
export class StatisticService {

  private url = `${environment.bookLocatorService.url}/statistics`;

  constructor(
    private http: HttpClient
  ) {
  }

  public getSearchStatistics(): Observable<any> {
    return this.http.get(`${this.url}/search`);
  }

  public getDailySearchStatistics(fields: string = '', filter: string = '', order: string = '', limit = 0, offset = 0): Observable<[string: number]> {
    const params: any = {
      fields,
      filter,
      order,
      limit,
      offset
    };

    return this.http.get<[string: number]>(`${this.url}/search/daily`, { params });
  }
}
