export interface Product {
    id: number;
    name: string;
    code: string;
    category: ProductCategory;
    description?: string;
    releaseDate: Date;
    price: number;
    rating: number;
    imageUrl?: string;
}

export enum ProductCategory {
    Unknown = 0,
    Garden = 1,
    Toolbox = 2,
    Gaming = 3,
    Fitness = 4,
    Others = 5
}

export const ProductCategoryDescriptions = new Map<number, string>([
  [ProductCategory.Unknown, 'Desconhecido'],
  [ProductCategory.Garden, 'Jardinagem'],
  [ProductCategory.Toolbox, 'Ferramenta'],
  [ProductCategory.Gaming, 'Videogame'],
  [ProductCategory.Fitness, 'Fitness'],
  [ProductCategory.Others, 'Outros']
]);
