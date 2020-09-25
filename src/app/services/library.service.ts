import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Library} from '../models/library.model';
import {Floor} from '../models/floor.model';

@Injectable()
export class LibraryService {

  private url = `${environment.bookLocatorService.url}/libraries`;

  constructor(
    private http: HttpClient
  ) {
  }

  public getLibrary(id: string): Observable<Library> {
    return this.http.get<Library>(`${this.url}/${id}`);
  }

  public getLibraries(fields?: string, filter?: string, order?: string, offset?: number, limit?: number): Observable<HttpResponse<Library[]>> {
    const params: any = {
      fields,
      filter,
      order,
      offset,
      limit
    };

    return this.http.get<Library[]>(`${this.url}`, {observe: 'response', params});
  }

  public createLibrary(library: Library): Observable<Library> {
    return this.http.post(`${this.url}`, library);
  }

  public patchLibrary(id: string, library: Library): Observable<Library> {
    return this.http.patch(`${this.url}/${id}`, library);
  }

  public getLibraryFloors(id: string, fields?: string, filter?: string, order?: string, offset?: number, limit?: number): Observable<HttpResponse<Floor[]>> {
    const params: any = {
      fields,
      filter,
      order,
      offset,
      limit
    };

    return this.http.get<Floor[]>(`${this.url}/${id}/floors`, {observe: 'response', params});
  }

  public createLibraryFloor(id: string, floor: Floor): Observable<Floor> {
    return this.http.post(`${this.url}/${id}/floors`, floor);
  }
}
