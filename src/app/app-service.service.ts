import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const newLocal = 'https://public-api.wordpress.com/rest/v1.1/sites/vocon-it.com/posts';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {
  protected restItemUrl: string = newLocal;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http
      .get<any>(this.restItemUrl)
      .pipe(map((data) => data));
  }
}
