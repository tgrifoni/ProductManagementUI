import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Product, ProductCategory } from './product';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    private http: HttpClient,
    private authService: AuthService) { }

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/product`)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  getById(id: number): Observable<Product> {
    if (id === 0) {
      return of(this.initializeNewProduct());
    }

    return this.http.get<Product>(`${environment.apiUrl}/product/${id}`)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  delete(id: number): Observable<{}> {
    return this.http.delete(`${environment.apiUrl}/product/${id}`)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  save(product: Product, id: number): Observable<{}> {
    const request = { Product: product };

    if (product.id === 0 && id === 0) {
      return this.http.post(`${environment.apiUrl}/product`, request)
        .pipe(
          catchError(error => this.handleError(error))
        );
    }

    return this.http.put(`${environment.apiUrl}/product/${id}`, request)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }

  initializeNewProduct(): Product {
    return {
      id: 0,
      name: '',
      code: '',
      category: ProductCategory.Unknown,
      description: '',
      releaseDate: new Date(),
      price: null,
      rating: 0,
      imageUrl: ''
    };
  }

  private handleError(errorResponse: HttpErrorResponse) {
    const unauthorizedStatusCode = 401;

    if (errorResponse.status === unauthorizedStatusCode) {
      this.authService.logout('/login');
      return throwError('Sua sessão expirou ! Faça login novamente.');
    }

    let errorMessage = 'Ocorreu um erro ! ';
    if (errorResponse.error instanceof ErrorEvent) {
      errorMessage += `${errorResponse.error.message}`;
    } else if (errorResponse.error instanceof ProgressEvent || !errorResponse.error) {
      errorMessage += 'Falha ao tentar conectar com o servidor. Tente novamente mais tarde.';
    } else if (typeof errorResponse.error === 'string') {
      errorMessage += `${errorResponse.error}`;
    } else if (errorResponse.error.errors) {
      errorMessage = `Ocorreram erros de validação !`;
    }
    return throwError(errorMessage);
  }
}
