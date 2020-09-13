import {HttpClient} from '@angular/common/http';
import {EMPTY, Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {catchError, shareReplay} from 'rxjs/operators';

@Injectable()
export class JSONService {

  private cache: { [url: string]: Observable<any> } = {};

  constructor(
    private http: HttpClient
  ) {
  }

  public getJSON(url: string): Observable<any> {
    if (this.cache[url]) {
      return this.cache[url];
    }

    this.cache[url] = this.http.get(url)
      .pipe(
        shareReplay(1),
        catchError(err => {
          delete this.cache[url];
          return EMPTY;
        })
      );

    return this.cache[url];
  }
}
