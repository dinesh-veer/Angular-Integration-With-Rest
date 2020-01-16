import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

const newLocal = "https://public-api.wordpress.com/rest/v1.1/sites/vocon-it.com/posts";
@Injectable({
  providedIn: 'root'
})
export class AppServiceService implements OnInit{
  ngOnInit(): void {
    
  }

  constructor(private http:HttpClient) { }
protected  restItemUrl:string=newLocal;


getAll(){
  return this.http
  .get<any[]>(this.restItemUrl)
  .pipe(map(data=>data))
}
}
