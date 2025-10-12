---
id: 16
name: Angular Error Handling Patterns
topic: angular
fileName: angular/angular-error-handling-patterns
---

# Angular Error Handling Patterns

## Overview

Error handling is a critical aspect of building robust Angular applications. This guide covers comprehensive error handling patterns, from basic HTTP error management to advanced reactive error handling strategies that promote maintainability and user experience.

## Reactive Error Handling with RxJS

### The Problem: Raw HTTP Errors

When using Angular's HttpClient, errors are typically handled in the subscription's error callback:

```typescript
// ❌ Basic approach - leads to scattered error handling
this.http.get('/api/data').subscribe({
  next: data => console.log(data),
  error: err => {
    // err is HttpErrorResponse - generic error type
    if (err.status === 404) {
      this.showNotFoundError();
    } else if (err.status === 500) {
      this.showServerError();
    }
    // This logic gets repeated in every component!
  }
});
```

### The Solution: Centralized Error Transformation

Using RxJS `catchError` operator in services transforms raw HTTP errors into domain-specific errors:

```typescript
// ✅ Recommended approach - centralized error handling
@Injectable({ providedIn: 'root' })
export class DataService {

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 404) {
      return throwError(() => new NotFoundError(error.url));
    } else if (error.status === 500) {
      return throwError(() => new ServerError(error.message));
    } else {
      return throwError(() => new UnexpectedError(error.message));
    }
  }

  getData(): Observable<DataModel> {
    return this.http.get<DataModel>('/api/data').pipe(
      catchError(error => this.handleError(error))
    );
  }
}
```

## Error Type Hierarchy

### Domain-Specific Error Classes

Create typed error classes that provide context and meaning:

```typescript
// Base error interface
export interface AppError {
  message: string;
  timestamp: Date;
  userMessage: string;
}

// Specific error types
export class NotFoundError implements AppError {
  message: string;
  timestamp = new Date();
  userMessage: string;

  constructor(resource?: string) {
    this.message = `Resource not found: ${resource}`;
    this.userMessage = 'The requested resource could not be found. Please check the URL and try again.';
  }
}

export class ValidationError implements AppError {
  message: string;
  timestamp = new Date();
  userMessage: string;
  field: string;

  constructor(field: string, value: any) {
    this.field = field;
    this.message = `Validation failed for field: ${field}`;
    this.userMessage = `Invalid value for ${field}. Please provide a valid ${field}.`;
  }
}

export class NetworkError implements AppError {
  message: string;
  timestamp = new Date();
  userMessage: string;

  constructor(originalError: any) {
    this.message = `Network error: ${originalError.message}`;
    this.userMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
  }
}

export class UnauthorizedError implements AppError {
  message: string;
  timestamp = new Date();
  userMessage: string;

  constructor() {
    this.message = 'Authentication required';
    this.userMessage = 'You need to log in to access this resource.';
  }
}
```

## Service Layer Error Handling

### HTTP Error Mapping Strategy

Transform HTTP status codes into meaningful domain errors:

```typescript
@Injectable({ providedIn: 'root' })
export class ApiService {

  private mapHttpError(error: HttpErrorResponse, context?: string): Observable<never> {
    // Network errors (status 0)
    if (error.status === 0) {
      return throwError(() => new NetworkError(error));
    }

    // Client errors (4xx)
    if (error.status >= 400 && error.status < 500) {
      switch (error.status) {
        case 400:
          return throwError(() => new ValidationError(
            error.error?.field || 'request',
            error.error?.value
          ));
        case 401:
          return throwError(() => new UnauthorizedError());
        case 403:
          return throwError(() => new ForbiddenError(error.error?.message));
        case 404:
          return throwError(() => new NotFoundError(context));
        case 422:
          return throwError(() => new ValidationErrors(error.error?.errors || []));
        case 429:
          return throwError(() => new RateLimitError(error.error?.retryAfter));
        default:
          return throwError(() => new ClientError(error.status, error.message));
      }
    }

    // Server errors (5xx)
    if (error.status >= 500) {
      return throwError(() => new ServerError(error.status, error.message));
    }

    // Unknown errors
    return throwError(() => new UnexpectedError(error.message));
  }

  get<T>(url: string, context?: string): Observable<T> {
    return this.http.get<T>(url).pipe(
      catchError(error => this.mapHttpError(error, context))
    );
  }

  post<T>(url: string, body: any, context?: string): Observable<T> {
    return this.http.post<T>(url, body).pipe(
      catchError(error => this.mapHttpError(error, context))
    );
  }
}
```

### Specialized Service Example

```typescript
@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private api: ApiService) {}

  getUser(id: string): Observable<User> {
    return this.api.get<User>(`/users/${id}`, `User ${id}`).pipe(
      // Additional service-specific error handling if needed
      catchError(error => {
        if (error instanceof NotFoundError) {
          return throwError(() => new UserNotFoundError(id));
        }
        return throwError(() => error);
      })
    );
  }

  createUser(userData: CreateUserRequest): Observable<User> {
    return this.api.post<User>('/users', userData, 'User creation').pipe(
      // Handle user-specific validation errors
      catchError(error => {
        if (error instanceof ValidationError) {
          return throwError(() => new UserCreationValidationError(error.field));
        }
        return throwError(() => error);
      })
    );
  }
}
```

## Component Layer Error Handling

### Type-Safe Error Handling

Components can now handle specific error types with confidence:

```typescript
@Component({
  selector: 'app-user-profile',
  template: `
    <div *ngIf="error" class="error-message">
      {{ error.userMessage }}
      <button (click)="retry()">Retry</button>
    </div>

    <div *ngIf="loading" class="loading">
      Loading user data...
    </div>

    <user-details *ngIf="user" [user]="user"></user-details>
  `
})
export class UserProfileComponent implements OnInit {
  user: User | null = null;
  loading = false;
  error: AppError | null = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUser();
  }

  private loadUser() {
    this.loading = true;
    this.error = null;

    this.userService.getUser('123').subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: (error: AppError) => {
        this.error = error;
        this.loading = false;

        // Handle specific error types
        if (error instanceof UnauthorizedError) {
          this.redirectToLogin();
        } else if (error instanceof NetworkError) {
          this.scheduleRetry();
        }

        // Log for debugging
        console.error('Failed to load user:', error);
      }
    });
  }

  retry() {
    this.loadUser();
  }

  private redirectToLogin() {
    // Navigate to login page
  }

  private scheduleRetry() {
    // Implement exponential backoff retry logic
    setTimeout(() => this.loadUser(), 5000);
  }
}
```

## Advanced Error Handling Patterns

### Global Error Handler

Implement a global error handler for unhandled errors:

```typescript
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(private errorService: ErrorService) {}

  handleError(error: any): void {
    // Don't handle controlled errors globally
    if (error instanceof AppError) {
      return;
    }

    // Handle unexpected errors
    console.error('Unexpected error occurred:', error);

    // Send to error tracking service
    this.errorService.trackError(error);

    // Show user-friendly message
    this.errorService.showGlobalError(
      'An unexpected error occurred. Please try again.'
    );
  }
}

// Register in app.module.ts
providers: [
  { provide: ErrorHandler, useClass: GlobalErrorHandler }
]
```

### Error Interceptor

HTTP interceptor for consistent error handling:

```typescript
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private errorService: ErrorService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Log errors
        this.errorService.logHttpError(error, req);

        // Handle authentication errors globally
        if (error.status === 401) {
          this.errorService.handleAuthenticationError();
        }

        // Pass error to the next handler
        return throwError(() => error);
      })
    );
  }
}
```

### Retry Logic with Exponential Backoff

```typescript
export function retryWithBackoff<T>(
  maxRetries: number = 3,
  delay: number = 1000
): MonoTypeOperatorFunction<T> {
  return pipe(
    retryWhen(errors =>
      errors.pipe(
        mergeMap((error, index) => {
          // Don't retry on client errors (4xx)
          if (error.status >= 400 && error.status < 500) {
            return throwError(() => error);
          }

          // Check retry limit
          const retryAttempt = index + 1;
          if (retryAttempt > maxRetries) {
            return throwError(() => error);
          }

          // Calculate delay with exponential backoff
          const backoffDelay = delay * Math.pow(2, retryAttempt - 1);

          console.log(`Retry attempt ${retryAttempt} in ${backoffDelay}ms`);

          return timer(backoffDelay);
        })
      )
    )
  );
}

// Usage in service
getData(): Observable<DataModel> {
  return this.http.get<DataModel>('/api/data').pipe(
    retryWithBackoff(3, 1000),
    catchError(error => this.handleError(error))
  );
}
```

## Error State Management

### Error State Service

```typescript
@Injectable({ providedIn: 'root' })
export class ErrorStateService {

  private errorSubject = new BehaviorSubject<AppError | null>(null);
  public error$ = this.errorSubject.asObservable();

  setError(error: AppError): void {
    this.errorSubject.next(error);
  }

  clearError(): void {
    this.errorSubject.next(null);
  }

  hasError(): boolean {
    return this.errorSubject.value !== null;
  }

  getCurrentError(): AppError | null {
    return this.errorSubject.value;
  }
}
```

### Error Component

```typescript
@Component({
  selector: 'app-error-display',
  template: `
    <div *ngIf="error$ | async as error" class="error-container">
      <div class="error-message" [ngClass]="error.constructor.name.toLowerCase()">
        <mat-icon class="error-icon">error</mat-icon>
        <div class="error-content">
          <h3>{{ getErrorTitle(error) }}</h3>
          <p>{{ error.userMessage }}</p>
          <div class="error-actions">
            <button mat-button (click)="retry()" *ngIf="showRetry(error)">
              Retry
            </button>
            <button mat-button (click)="dismiss()">
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ErrorDisplayComponent {
  error$ = this.errorStateService.error$;
  retry = new EventEmitter<void>();

  constructor(private errorStateService: ErrorStateService) {}

  getErrorTitle(error: AppError): string {
    if (error instanceof NetworkError) return 'Connection Error';
    if (error instanceof NotFoundError) return 'Not Found';
    if (error instanceof ValidationError) return 'Invalid Input';
    if (error instanceof UnauthorizedError) return 'Authentication Required';
    return 'Error';
  }

  showRetry(error: AppError): boolean {
    return error instanceof NetworkError || error instanceof ServerError;
  }

  dismiss(): void {
    this.errorStateService.clearError();
  }
}
```

## Best Practices

### 1. **Separation of Concerns**
- Services handle error transformation
- Components handle UI response
- Global handlers track unexpected errors

### 2. **User-Friendly Messages**
- Provide actionable error messages
- Include retry mechanisms where appropriate
- Use consistent styling and presentation

### 3. **Error Logging**
- Log technical details for debugging
- Track errors for monitoring and analytics
- Include context (user, URL, timestamp)

### 4. **Type Safety**
- Use TypeScript interfaces for error types
- Leverage `instanceof` checks for specific handling
- Maintain consistent error signatures

### 5. **Graceful Degradation**
- Implement fallback behavior for critical failures
- Cache data when possible to provide offline experience
- Show loading states during retry attempts

## Conclusion

Effective error handling in Angular applications requires a layered approach that combines RxJS operators, domain-specific error types, and user-friendly presentation. By centralizing error transformation in services and using typed error handling in components, you create maintainable code that provides excellent user experience while maintaining robust error recovery mechanisms.

This pattern ensures that error handling logic is reusable, consistent, and easily testable across your application.