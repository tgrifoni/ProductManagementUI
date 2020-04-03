import { Component, OnInit, ViewChild } from '@angular/core';

import { Product } from './product';
import { ProductService } from './product.service';
import { LoaderService } from '../shared/loader.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  displayedColumns = ['name', 'code', 'releaseDate', 'price', 'update', 'delete'];
  pageTitle = 'Lista de Produtos';

  products: MatTableDataSource<Product>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private productService: ProductService,
    private loaderService: LoaderService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.getProducts();
  }

  private getProducts() {
    this.loaderService.startedLoading();
    this.productService.getAll().subscribe(
      products => {
        this.products = new MatTableDataSource(products);
        this.products.paginator = this.paginator;
        this.products.sort = this.sort;
        this.loaderService.finishedLoading();
      },  error => {
        this.openSnackBar(`Erro ao buscar produtos: ${error}`);
        this.loaderService.finishedLoading();
      });
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', { duration: 3000 });
  }

  private deleteFromDataSource(product: Product) {
    const index = this.products.data.indexOf(product);
    this.products.data.splice(index, 1);
    this.products._updateChangeSubscription();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.products.filter = filterValue.trim().toLowerCase();

    if (this.products.paginator) {
      this.products.paginator.firstPage();
    }
  }

  confirmDeletion(product: Product) {
    const canDelete = confirm(`Deseja realmente deletar o produto ${product.name} ?`);

    if (!canDelete) {
      return;
    }

    this.loaderService.startedLoading();
    this.productService.delete(product.id).subscribe(
      () => {
        this.openSnackBar('O produto foi excluído');
        this.deleteFromDataSource(product);
        this.loaderService.finishedLoading();
      }, error => {
        this.openSnackBar(`Erro ao deletar produto: ${error}`);
        this.loaderService.finishedLoading();
      });
  }
}
