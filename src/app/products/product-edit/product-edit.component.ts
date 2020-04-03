import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Product, ProductCategory } from '../product';
import { ProductService } from '../product.service';
import { LoaderService } from 'src/app/shared/loader.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DateAdapter } from '@angular/material';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  pageTitle: string;
  productForm: FormGroup;

  private currentProduct: Product;
  private originalProduct: Product;

  minDate = new Date(2015, 0, 1);
  maxDate: Date;

  get f() { return this.productForm.controls; }

  get isDirty(): boolean {
    return JSON.stringify(this.originalProduct) !== JSON.stringify(this.productForm.value);
  }

  get productName(): string {
    return this.originalProduct.name;
  }
  set product(value: Product) {
    this.originalProduct = value;
    this.currentProduct = { ...value };
  }

  constructor(
    private productService: ProductService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private dateAdapter: DateAdapter<Date>) {
      const currentYear = new Date().getFullYear();
      this.maxDate = new Date(currentYear + 5, 11, 31);
      this.dateAdapter.setLocale('pt-BR');

      this.productForm = this.fb.group({
        id: [0],
        name: ['', [Validators.required, Validators.maxLength(100)]],
        code: ['', [Validators.required, Validators.pattern(/^[A-Za-z]{3}-\d{4}$/)]],
        category: [ProductCategory.Unknown, [Validators.required, Validators.min(1)]],
        description: ['', Validators.maxLength(200)],
        releaseDate: [new Date(), Validators.required],
        price: [null, [Validators.required, Validators.min(0.01), Validators.max(99999.99), Validators.pattern(/^\d{1,5}([.,]\d{1,2})?$/)]],
        rating: [0, [Validators.min(0), Validators.max(5)]],
        imageUrl: ['']
      });
    }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.getProduct(id);
  }

  private getProduct(id: number) {
    this.loaderService.startedLoading();
    this.productService.getById(id).subscribe(product => {
      this.product = product;
      if (!this.originalProduct) {
        this.pageTitle = 'Produto não encontrado';
      } else if (this.originalProduct.id === 0) {
        this.pageTitle = 'Adicionar Produto';
      } else {
        this.pageTitle = `Editar Produto: ${this.originalProduct.name}`;
      }
      this.productForm.setValue(this.currentProduct);
      this.loaderService.finishedLoading();
    }, error => {
      this.openSnackBar(`Erro ao buscar produto: ${error}`);
      this.loaderService.finishedLoading();
    });
  }

  private assignProduct() {
    this.currentProduct.name = this.productForm.get('name').value;
    this.currentProduct.code = this.productForm.get('code').value;
    this.currentProduct.category = +this.productForm.get('category').value;
    this.currentProduct.description = this.productForm.get('description').value;
    this.currentProduct.releaseDate = this.productForm.get('releaseDate').value as Date;
    this.currentProduct.price = +this.productForm.get('price').value.toString().replace(',', '.');
    this.currentProduct.rating = +this.productForm.get('rating').value;
    this.currentProduct.imageUrl = this.productForm.get('imageUrl').value;
  }

  private onSaveCompleted(message: string) {
    this.openSnackBar(message);
    this.reset();
    this.router.navigate(['/products']);
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'OK', { duration: 3000 });
  }

  private reset() {
    this.originalProduct = this.productService.initializeNewProduct();
    this.currentProduct = this.originalProduct;
    this.productForm.setValue(this.originalProduct);
  }

  onSubmit() {
    if (this.productForm.dirty && !this.productForm.valid) {
      this.openSnackBar('O formulário não está válido. Valide os dados e tente novamente.');
      return;
    }

    this.assignProduct();

    this.productService.save(this.currentProduct, this.originalProduct.id).subscribe(
      () => this.onSaveCompleted('Produto salvo com sucesso !'),
      error => this.openSnackBar(`Erro ao salvar o produto: ${error}`)
    );
  }
}
