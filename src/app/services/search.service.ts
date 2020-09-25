import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Injectable} from '@angular/core';
import {SearchResponse} from '../models/responses/search-response.model';

@Injectable()
export class SearchService {

  private url = `${environment.bookLocatorService.url}/search`;

  constructor(
    private http: HttpClient
  ) {
  }

  public getSearchResponse(query: string): Observable<SearchResponse> {
    const params: any = {
      q: query
    };

    return this.http.get<SearchResponse>(`${this.url}`, {params});
  }
}
