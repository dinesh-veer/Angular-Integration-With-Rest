# Angular Integration with REST Services

An Angular application demonstrating **REST API consumption**, **reactive data streams using RxJS**, and **modern standalone component architecture**.

The project showcases both the **traditional Angular (NgModule-based) pattern** and the **modern Angular (Standalone Components, `provideHttpClient`, and Vitest)** approach.

The main purpose of this project is to demonstrate how Angular communicates with external REST endpoints, manages asynchronous data flow, and renders dynamic content cleanly with minimal boilerplate.

---

## Overview

This application consumes posts from an external WordPress Public REST API, displays them in an interactive list, and dynamically loads the post body when an item is clicked.

The workflow follows this pattern:

```text
External REST API
       ↓
HttpClient GET Request
       ↓
AppServiceService (RxJS Observable)
       ↓
AppComponent (Subscription & State)
       ↓
Dynamic HTML View Rendering
```

The application demonstrates the progression from legacy Angular patterns to modern best practices:

### Old / Traditional Approach (Angular 6+)

```text
AppModule
  ↓
HttpClientModule
  ↓
platformBrowserDynamic().bootstrapModule(AppModule)
  ↓
Karma + Jasmine + Headless Chrome
  ↓
Webpack Browser Builder
```

### Modern Approach (Angular 21+)

```text
bootstrapApplication(AppComponent, appConfig)
  ↓
provideHttpClient() & provideZoneChangeDetection()
  ↓
Standalone AppComponent
  ↓
Vitest + JSDOM (Fast Unit Tests)
  ↓
Vite-Powered Application Builder (@angular/build)
```

---

# Technologies

* **Angular 21** (`@angular/core`, `@angular/common`, `@angular/router`)
* **TypeScript 5.9**
* **RxJS 7.8** (Reactive Extensions for JavaScript)
* **Zone.js 0.15+** (Change Detection Execution Context)
* **@angular/build** (Modern Vite-based Application Bundler)
* **Vitest & JSDOM** (Fast, modern unit testing framework)
* **Node.js 22+ / 24+**
* **npm 11+**
* **HTML5 & CSS3**

---

# Project Structure

```text
Angular-Integration-With-Rest
│
├── public
│   └── favicon.ico                   # Static application assets
│
├── src
│   ├── app
│   │   ├── app.component.css         # Root component styles
│   │   ├── app.component.html        # Root component template with post list & viewer
│   │   ├── app.component.spec.ts     # Component unit tests (Vitest)
│   │   ├── app.component.ts          # Standalone root component
│   │   ├── app.config.ts             # Application configuration & providers
│   │   ├── app-service.service.ts    # REST API service using HttpClient
│   │   └── app-service.service.spec.ts # Service unit tests with HttpTestingController
│   │
│   ├── index.html                    # Root HTML document
│   ├── main.ts                       # Application entry point (bootstrapApplication)
│   └── styles.css                    # Global application styles
│
├── docs                              # Project documentation site
├── angular.json                      # Angular CLI workspace & build configuration
├── package.json                      # Project dependencies & scripts
├── tsconfig.json                     # Root TypeScript configuration
├── tsconfig.app.json                 # Application TypeScript build configuration
├── tsconfig.spec.json                # Test suite TypeScript configuration
└── README.md
```

---

# REST API & Data Model

The application communicates with the public WordPress REST API endpoint:

```text
https://public-api.wordpress.com/rest/v1.1/sites/vocon-it.com/posts
```

### API Data Structure

```text
Response
 ├── found (number)
 └── posts (array)
      ├── ID (number)
      ├── title (string, HTML encoded)
      ├── content (string, HTML)
      ├── date (string, ISO timestamp)
      └── author (object)
```

### Example JSON Response

```json
{
  "found": 148,
  "posts": [
    {
      "ID": 7108,
      "title": "Enable User Namespaces in Kubernetes",
      "content": "<p>User namespaces are a Linux kernel feature...</p>",
      "date": "2025-05-07T11:50:43+00:00",
      "author": {
        "name": "Oliver Veits"
      }
    }
  ]
}
```

---

# Service Implementation

The `AppServiceService` encapsulates HTTP communication using Angular's `HttpClient`:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const API_URL = 'https://public-api.wordpress.com/rest/v1.1/sites/vocon-it.com/posts';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {
  protected restItemUrl: string = API_URL;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http
      .get<any>(this.restItemUrl)
      .pipe(map((data) => data));
  }
}
```

### Key Service Features:
* **Root Injection**: `providedIn: 'root'` provides a single application-wide singleton instance without requiring module declarations.
* **RxJS Pipeline**: Employs `Observable` streams with RxJS operators (`map`) to transform or pass through HTTP responses.

---

# Component & View Implementation

The root component is implemented as a **Standalone Component**:

```typescript
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
      },
      error: (err) => {
        console.error('Failed to load blog posts:', err);
      }
    });
  }
}
```

### Component Template (`app.component.html`)

```html
<div>
  <h1>Blog Posts</h1>
  
  <!-- Loading spinner while waiting for HTTP response -->
  <div *ngIf="undefined === restItems" class="loading-container">
    <div class="spinner" role="status" aria-label="Loading"></div>
    <p class="loading-text">Loading...</p>
  </div>

  <!-- Render list once data arrives -->
  <div *ngIf="undefined !== restItems">
    <ul>
      <li *ngFor="let post of restItems['posts']" 
          [innerHTML]="post.title"
          (click)="selectedContent = '<h1>' + post.title + '</h1>' + post.content">
      </li>
    </ul>
  </div>

  <!-- Detailed post content display -->
  <div [innerHTML]="selectedContent"></div>
</div>
```

---

# Change Detection & Asynchronous Flow

In modern Angular applications, change detection triggers on asynchronous events:

```text
┌─────────────────────────┐
│ WordPress REST Endpoint │
└───────────┬─────────────┘
            |
            | HTTP Response (JSON)
            ↓
┌─────────────────────────┐
│      HttpClient         │
└───────────┬─────────────┘
            |
            | RxJS Observable
            ↓
┌─────────────────────────┐
│  subscribe() Callback   │
│  - this.restItems = ... │
│  - cdr.markForCheck()   │
└───────────┬─────────────┘
            |
            | Zone.js / CD Tick
            ↓
┌─────────────────────────┐
│   DOM Re-rendered       │
│   Posts list shown      │
└─────────────────────────┘
```

### Why `zone.js` and `ChangeDetectorRef` are used:
* **Zone.js**: Automatically intercepts asynchronous tasks (XHR/Fetch, timers, microtasks) and triggers an application change detection cycle.
* **`cdr.markForCheck()`**: Explicitly flags the component tree for check, ensuring immediate UI updates regardless of whether the application is running in zone-based or zoneless execution mode.

---

# Traditional vs. Modern Angular Comparison

| Feature | Legacy Approach (Angular 6-16) | Modern Approach (Angular 17-21+) |
| :--- | :--- | :--- |
| **Bootstrapping** | `platformBrowserDynamic().bootstrapModule(AppModule)` | `bootstrapApplication(AppComponent, appConfig)` |
| **Component Model** | `NgModule` declarations in `app.module.ts` | `standalone: true` with direct `imports: [...]` |
| **HTTP Injection** | `HttpClientModule` imported in NgModule | `provideHttpClient()` configured in `appConfig` |
| **Change Detection** | Implicit Zone.js full-app traversal | Configurable Zone.js (`provideZoneChangeDetection`) or Zoneless |
| **Bundling Engine** | Webpack (`@angular-devkit/build-angular:browser`) | Vite + Rollup / esbuild (`@angular/build:application`) |
| **Test Runner** | Karma + Jasmine + Chrome launcher | Vitest (`@angular/build:unit-test`) + JSDOM |
| **Linting / Tooling** | TSLint (Deprecated) | ESLint / Prettier |

---

# Running the Application

### Prerequisites

* **Node.js**: `v20+` or `v22+` (v24 supported)
* **npm**: `v10+` or `v11+`

### 1. Clone the repository

```bash
git clone https://github.com/dinesh-veer/Angular-Integration-With-Rest.git
```

### 2. Navigate to project directory

```bash
cd Angular-Integration-With-Rest
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm start
```

Navigate to:

```text
http://localhost:4200/
```

The application will automatically reload if any source file changes.

---

# Build

Compile the project into static production assets:

```bash
npm run build
```

The output artifacts are stored in:

```text
dist/hello-angular/browser
```

To preview the production build locally:

```bash
npx serve dist/hello-angular/browser
```

---

# Running Unit Tests

Run unit tests via **Vitest**:

```bash
npm test
```

### Test Suite Highlights:
* **`AppServiceService`**: Verifies that the service instantiates and queries the WordPress REST API correctly using `HttpTestingController`.
* **`AppComponent`**: Validates component creation, title rendering, and DOM updates when mock blog posts are emitted.

---

# Key Concepts Demonstrated

* REST API integration via Angular's `HttpClient`
* Standalone Components (`standalone: true`)
* Application-level providers (`ApplicationConfig`, `provideHttpClient`, `provideZoneChangeDetection`)
* RxJS Observables and operator pipelines (`map`)
* Template data binding (`*ngIf`, `*ngFor`, `(click)`, `[innerHTML]`)
* Asynchronous change detection management (`ChangeDetectorRef`)
* Modern testing with Vitest and `HttpTestingController`
* Modern Vite-based build pipeline (`@angular/build`)

---

# Learning Path

A recommended order to explore and study this codebase:

### 1. Configuration & Bootstrap
Inspect [`src/main.ts`](src/main.ts) and [`src/app/app.config.ts`](src/app/app.config.ts) to see how standalone apps are initialized without an `AppModule`.

### 2. Service Layer & HTTP
Examine [`src/app/app-service.service.ts`](src/app/app-service.service.ts) to understand how `HttpClient` calls return typed RxJS Observables.

### 3. Component & View Binding
Review [`src/app/app.component.ts`](src/app/app.component.ts) and [`src/app/app.component.html`](src/app/app.component.html) to see how asynchronous data is consumed and rendered.

### 4. Unit Testing
Check [`src/app/app-service.service.spec.ts`](src/app/app-service.service.spec.ts) and [`src/app/app.component.spec.ts`](src/app/app.component.spec.ts) to learn how to test modern Angular components and HTTP services with Vitest.

---

# Repository

GitHub:

https://github.com/dinesh-veer/Angular-Integration-With-Rest

# Author

**Dinesh Veer**

GitHub:

https://github.com/dinesh-veer
