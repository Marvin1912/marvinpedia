---
id: 16
name: Angular Error Handling Patterns
topic: angular
fileName: angular/angular-error-handling-patterns
---

# Angular Error Handling: Service vs Component Error Handling

## Overview

Angular developers often face a choice: handle HTTP errors in components or transform them in services. This guide explains why using RxJS `catchError` in services is the superior approach for building maintainable applications.

## The Problem: Component-Level Error Handling

When handling errors only in component subscription callbacks:

```typescript
// ❌ Scattered error handling - repeated in every component
this.http.get<User>('/api/users/123').subscribe({
  next: user => this.user = user,
  error: err => {
    if (err.status === 404) {
      this.showError('User not found');
    } else if (err.status === 429) {
      this.showError('Rate limit exceeded');
    } else if (err.status === 500) {
      this.showError('Server error');
    }
    // This logic gets duplicated across components!
  }
});
```

**Issues with this approach:**
- Error handling logic is scattered across components
- Inconsistent error messages and handling
- Difficult to maintain and update
- No type safety for specific error types

## The Solution: Service Layer Error Transformation

Using RxJS `catchError` operator to transform raw HTTP errors into domain-specific errors:

```typescript
// ✅ Centralized error transformation
@Injectable({ providedIn: 'root' })
export class UserService {

  private transformError(error: HttpErrorResponse, context: string): Observable<never> {
    if (error.status === 404) {
      return throwError(() => new NotFoundError(context));
    } else if (error.status === 429) {
      return throwError(() => new RateLimitError());
    } else if (error.status === 500) {
      return throwError(() => new ServerError());
    } else {
      return throwError(() => new UnexpectedError(error.message));
    }
  }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`/api/users/${id}`).pipe(
      catchError(error => this.transformError(error, `User ${id}`))
    );
  }
}
```

## Domain-Specific Error Classes

Create typed errors that provide context and user-friendly messages:

```typescript
export interface AppError {
  message: string;
  userMessage: string;
}

export class NotFoundError implements AppError {
  constructor(private resource: string) {}

  get message() {
    return `Resource not found: ${this.resource}`;
  }

  get userMessage() {
    return `The ${this.resource} could not be found. Please check the details and try again.`;
  }
}

export class RateLimitError implements AppError {
  message = 'Rate limit exceeded';
  userMessage = 'Too many requests. Please wait a moment and try again.';
}

export class ServerError implements AppError {
  message = 'Server error';
  userMessage = 'Server is temporarily unavailable. Please try again later.';
}
```

## Component Benefits

Components now receive specific, typed errors:

```typescript
@Component({ /* ... */ })
export class UserProfileComponent {
  user: User | null = null;
  error: AppError | null = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUser('123').subscribe({
      next: user => this.user = user,
      error: (error: AppError) => {
        this.error = error;

        // Type-safe error handling
        if (error instanceof RateLimitError) {
          this.scheduleRetry();
        }

        console.error('Failed to load user:', error.message);
      }
    });
  }

  private scheduleRetry() {
    setTimeout(() => this.ngOnInit(), 5000);
  }
}
```

## Why This Approach is Better

### 1. **Single Source of Truth**
All error transformation logic lives in one place (the service layer)

### 2. **Consistency**
All components receive the same error types and messages

### 3. **Type Safety**
Components can use `instanceof` checks and get IntelliSense support

### 4. **Maintainability**
Update error handling once in the service, affects all consumers

### 5. **Testability**
Services can be unit tested for error transformation independently

## Complete Service Example

```typescript
@Injectable({ providedIn: 'root' })
export class ApiService {

  private mapError(error: HttpErrorResponse, context: string): Observable<never> {
    switch (error.status) {
      case 400:
        return throwError(() => new ValidationError());
      case 401:
        return throwError(() => new UnauthorizedError());
      case 404:
        return throwError(() => new NotFoundError(context));
      case 429:
        return throwError(() => new RateLimitError());
      case 500:
        return throwError(() => new ServerError());
      default:
        return throwError(() => new UnexpectedError(error.message));
    }
  }

  get<T>(url: string, context: string): Observable<T> {
    return this.http.get<T>(url).pipe(
      catchError(error => this.mapError(error, context))
    );
  }
}
```

## Best Practices

1. **Transform errors in services** - Use `pipe(catchError(...))` for all HTTP calls
2. **Create domain-specific errors** - Map HTTP status codes to meaningful error types
3. **Provide user-friendly messages** - Include both technical and user messages
4. **Handle errors specifically** - Use `instanceof` checks in components
5. **Keep error handling DRY** - Don't repeat error logic across components

## Conclusion

By moving error transformation from components to services using RxJS `catchError`, you create more maintainable, type-safe, and consistent error handling. This pattern ensures that error handling logic is centralized, reusable, and easily testable across your Angular application.