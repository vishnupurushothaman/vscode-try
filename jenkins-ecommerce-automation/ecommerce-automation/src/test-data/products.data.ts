import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Sauce Labs Backpack',
    description: 'carry.allTheThings() with the sleek, streamlined Sly Pack',
    price: 29.99,
  },
  {
    id: 2,
    name: 'Sauce Labs Bike Light',
    description: "A red light isn't the desired state in testing but it sure helps",
    price: 9.99,
  },
  {
    id: 3,
    name: 'Sauce Labs Bolt T-Shirt',
    description: 'Get your testing superhero on with the Sauce Labs bolt T-shirt',
    price: 15.99,
  },
  {
    id: 4,
    name: 'Sauce Labs Fleece Jacket',
    description: 'It\'s not every day that you come across a midweight quarter-zip fleece jacket',
    price: 49.99,
  },
  {
    id: 5,
    name: 'Sauce Labs Onesie',
    description: 'Rib snap infant onesie for the junior automation engineer',
    price: 7.99,
  },
  {
    id: 6,
    name: 'Test.allTheThings() T-Shirt (Red)',
    description: 'This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard',
    price: 15.99,
  },
];

export const PRODUCT_NAMES = PRODUCTS.map(p => p.name);

export const CHEAPEST_PRODUCT = PRODUCTS.reduce((a, b) => a.price < b.price ? a : b);
export const MOST_EXPENSIVE_PRODUCT = PRODUCTS.reduce((a, b) => a.price > b.price ? a : b);

export const SORT_OPTIONS = {
  AZ: 'Name (A to Z)',
  ZA: 'Name (Z to A)',
  LOHI: 'Price (low to high)',
  HILO: 'Price (high to low)',
} as const;
