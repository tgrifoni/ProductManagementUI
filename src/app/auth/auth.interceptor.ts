import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private snackBar: MatSnackBar,
        private router: Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authToken = window.localStorage.getItem('app-token');

        if (!authToken) {
            return next.handle(req);
        }
        const request = req.clone({ setHeaders: { Authorization: authToken } });

        return next.handle(request).pipe(
            tap(
                _ => _,
                (error: HttpErrorResponse) => {
                    const unauthorizedStatusCode = 401;
                    if (error.status !== unauthorizedStatusCode) {
                        return;
                    }

                    this.snackBar.open('Sua sessão expirou ! Faça login novamente.', 'OK', { duration: 3000 });
                    this.router.navigate(['/login']);
                }
            )
        );
    }
}
