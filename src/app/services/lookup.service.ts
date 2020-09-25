import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {BaseLookupType} from '../models/common/base-lookup-type.model';
import {Lookup} from '../models/enums/lookups.enum';
import {Injectable} from '@angular/core';

@Injectable()
export class LookupService {

  private url = `${environment.bookLocatorService.url}/lookups`;

  constructor(
    private http: HttpClient
  ) {
  }

  public getLookupValues(lookup: Lookup, fields?: string, filter?: string, order?: string, offset?: number, limit?: number): Observable<BaseLookupType[]> {
    const params: any = {
      fields,
      filter,
      order,
      offset,
      limit
    };

    return this.http.get<BaseLookupType[]>(`${this.url}/${encodeURIComponent(lookup)}`, {params});
  }
}
