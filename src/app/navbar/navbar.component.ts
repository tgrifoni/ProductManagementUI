import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  title = 'Gerenciamento de Produtos';

  get username() {
    return this.authService.username;
  }

  get isAuthenticated() {
    return this.authService.isAuthenticated;
  }

  constructor(
    private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
