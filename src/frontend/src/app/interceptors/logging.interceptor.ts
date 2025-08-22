import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('%c[HTTP REQUEST]', 'color: blue;', {
      url: req.url,
      method: req.method,
      headers: req.headers,
      body: req.body
    });

    return next.handle(req).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            console.log('%c[HTTP RESPONSE]', 'color: green;', {
              url: req.url,
              status: event.status,
              body: event.body
            });
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('%c[HTTP ERROR]', 'color: red;', {
            url: req.url,
            status: error.status,
            message: error.message,
            error: error.error
          });
        }
      })
    );
  }
}
