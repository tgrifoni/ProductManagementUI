import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationResponse } from './authentication-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  redirectUrl: string;

  constructor(
    private http: HttpClient,
    private router: Router) {}

  get isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  login(username: string, password: string) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: new HttpParams({ fromString: `username=${username}&password=${password}` })
    };
    return this.http.get<AuthenticationResponse>(`${environment.apiUrl}/authentication`, httpOptions)
    .pipe(
      tap(response => {
        this.isAuthenticated = response.isAuthenticated;
        window.localStorage.setItem('app-token', `Bearer ${response.token}`);
        window.localStorage.setItem('app-username', username);
      }),
      catchError(this.handleError)
    );
  }

  logout() {
    this.isAuthenticated = false;
    window.localStorage.clear();
    this.router.navigate(['/']);
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = 'Ocorreu um erro ! ';
    if (err.error instanceof ErrorEvent) {
      errorMessage += `${err.error.message}`;
    } else if (err.error instanceof ProgressEvent || !err.error) {
      errorMessage += 'Falha ao tentar conectar com o servidor. Tente novamente mais tarde.';
    } else if (typeof err.error === 'string') {
      errorMessage += `${err.error}`;
    } else if (err.error.errors) {
      errorMessage = `Ocorreram erros de validação !`;
    }
    return throwError(errorMessage);
  }
}
