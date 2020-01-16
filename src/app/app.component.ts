import { Component,OnInit } from '@angular/core';

import{AppServiceService} from './app-service.service'
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  title = 'Hello-Angula Teests';
  restItems:any;
  
  constructor(private http:HttpClient,private appService:AppServiceService){}
  ngOnInit(): void {
    this.getRestItems();
  }
getRestItems():void{
  this.appService.getAll()
  .subscribe(
    restItems=>{
     this.restItems=restItems;
     console.log(this.restItems);
    }
  )

}


}
