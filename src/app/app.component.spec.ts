import { TestBed } from '@angular/core/testing';
import { of, NEVER } from 'rxjs';
import { AppComponent } from './app.component';
import { AppServiceService } from './app-service.service';

describe('AppComponent', () => {
  const mockService = {
    getAll: () => of({
      posts: [
        { title: 'Test Post', content: '<p>Test Content</p>' }
      ]
    })
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: AppServiceService, useValue: mockService }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Hello-Angular'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Hello-Angular');
  });

  it('should render title in a h1 tag', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Blog Posts');
  });

  it('should render loading spinner when restItems is undefined', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: AppServiceService, useValue: { getAll: () => NEVER } }
      ]
    });
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.spinner')).toBeTruthy();
  });

  it('should display posts returned by service', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('li')?.textContent).toContain('Test Post');
  });
});
