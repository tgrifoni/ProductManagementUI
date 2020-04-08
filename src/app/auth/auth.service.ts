import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationResponse } from './authentication-response';

const loggedOffUsername = 'Anônimo';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _isAuthenticated = false;
  private _authToken: string;
  private _username = loggedOffUsername;
  redirectUrl: string;

  constructor(
    private http: HttpClient,
    private router: Router) {}

  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  get authToken(): string {
    return this._authToken;
  }

  get username(): string {
    return this._username;
  }

  login(username: string, password: string) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: new HttpParams({ fromString: `username=${username}&password=${password}` })
    };
    return this.http.get<AuthenticationResponse>(`${environment.apiUrl}/authentication`, httpOptions)
    .pipe(
      tap(response => {
        this._isAuthenticated = response.isAuthenticated;
        this._authToken = `Bearer ${response.token}`;
        this._username =  username;
      }),
      catchError(error => this.handleError(error))
    );
  }

  logout(redirectUrl = '/') {
    this._isAuthenticated = false;
    this._authToken = null;
    this._username = loggedOffUsername;
    this.router.navigate([redirectUrl]);
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
