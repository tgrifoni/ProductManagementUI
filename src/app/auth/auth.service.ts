import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  redirectUrl: string;

  get isLoggedIn(): boolean {
    return true;
  }

  login(userName: string, password: string) {
  }

  logout() {
  }
}
