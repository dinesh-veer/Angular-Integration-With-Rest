import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AppServiceService } from './app-service.service';

describe('AppServiceService', () => {
  let service: AppServiceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppServiceService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AppServiceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all posts from the REST API', () => {
    const mockPosts = {
      posts: [
        { id: 1, title: 'First Post', content: '<p>Hello</p>' }
      ]
    };

    service.getAll().subscribe((response) => {
      expect(response).toEqual(mockPosts);
    });

    const req = httpMock.expectOne('https://public-api.wordpress.com/rest/v1.1/sites/vocon-it.com/posts');
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });
});
