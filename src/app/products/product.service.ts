import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { environment } from 'src/environments/environment';

import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Product, ProductCategory } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/product`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getById(id: number): Observable<Product> {
    if (id === 0) {
      return of(this.initializeNewProduct());
    }

    return this.http.get<Product>(`${environment.apiUrl}/product/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  delete(id: number): Observable<{}> {
    return this.http.delete(`${environment.apiUrl}/product/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  save(product: Product, id: number): Observable<{}> {
    const request = { Product: product };

    if (product.id === 0 && id === 0) {
      return this.http.post(`${environment.apiUrl}/product`, request)
        .pipe(
          catchError(this.handleError)
        );
    }

    return this.http.put(`${environment.apiUrl}/product/${id}`, request)
        .pipe(
          catchError(this.handleError)
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
