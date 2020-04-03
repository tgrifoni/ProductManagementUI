import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Product, ProductCategory, ProductCategoryDescriptions } from '../product';
import { ProductService } from '../product.service';
import { LoaderService } from 'src/app/shared/loader.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  pageTitle: string;
  product: Product;

  constructor(
    private productService: ProductService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.getProduct(id);
  }

  private getProduct(id: number) {
    this.loaderService.startedLoading();
    this.productService.getById(id).subscribe(product => {
      this.product = product;
      if (this.product) {
        this.pageTitle = `Detalhes do Produto: ${this.product.name}`;
      } else {
        this.pageTitle = 'Produto não encontrado';
      }
      this.loaderService.finishedLoading();
    }, error => {
      this.snackBar.open(`Erro ao buscar produto: ${error}`, 'OK', { duration: 3000 });
      this.loaderService.finishedLoading();
    });
  }

  getCategoryDescription(category: ProductCategory) {
    return ProductCategoryDescriptions.get(category);
  }
}
