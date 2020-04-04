import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  pageTitle = 'Login';
  hidePassword: true;

  get f() {
    return this.loginForm.controls;
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', { duration: 3000 });
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      this.openSnackBar('O formulário não está válido. Valide os dados e tente novamente.');
      return;
    }

    const username = this.loginForm.get('username').value;
    const password = this.loginForm.get('password').value;
    this.authService.login(username, password).subscribe(
      () => {
        if (this.authService.redirectUrl) {
          this.router.navigateByUrl(this.authService.redirectUrl);
        } else {
          this.router.navigate(['/welcome']);
        }
      },
      error => this.openSnackBar(`Erro ao efetuar login: ${error}`)
    );
  }
}
