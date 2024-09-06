import { PaginationInterface, ProductInterface } from '../types';
import { request } from './request';

export async function getProducts() {
  const { errors, data } = await request<{
    data: ProductInterface[];
    pagination: PaginationInterface;
  }>('/products/?page=1&per_page=1000');

  if (errors || !data) throw new Error();
  return data;
}

export async function getProduct(productId: string) {
  const { errors, data } = await request<ProductInterface>(
    '/products/' + productId
  );
  if (errors || !data) throw new Error();
  return data;
}

export async function getUserProducts(userId: string) {
  const { errors, data } = await request<{
    data: ProductInterface[];
    pagination: PaginationInterface;
  }>('/products/?page=1&per_page=1000&seller=' + userId);

  if (errors || !data) throw new Error();
  return data;
}
