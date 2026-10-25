import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppServiceService } from './app-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Hello-Angular';
  restItems: any;
  selectedContent = '';

  constructor(
    private appService: AppServiceService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getRestItems();
  }

  getRestItems(): void {
    this.appService.getAll().subscribe({
      next: (restItems) => {
        this.restItems = restItems;
        this.cdr.markForCheck();
        console.log(this.restItems);
      },
      error: (err) => {
        console.error('Failed to load blog posts:', err);
      }
    });
  }
}
