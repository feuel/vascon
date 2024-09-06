'use server';

import { z } from 'zod';
import { request } from '../utils/request';
import {
  CartProductInterface,
  FormState,
  ProductPurchaseResponseInterface,
} from '../types';
import { getSession } from '../utils/session';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Helper to preprocess string to number
const toNumber = (value: unknown) => {
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? undefined : parsed;
  }
  return value;
};

const CreateProductFormSchema = z.object({
  name: z.string().min(1, { message: 'Enter product name' }).trim(),

  amount_available: z.preprocess(
    toNumber,
    z.number().min(1, { message: 'Must be greater than one' })
  ),

  cost: z.preprocess(
    toNumber,
    z.number().refine((value) => value % 5 === 0, {
      message: 'Cost must be a multiple of 5 unit coins',
    })
  ),

  product_id: z.optional(z.string()),
});

const EditProductFormSchema = CreateProductFormSchema.refine(
  (data) => !!data.product_id,
  {
    path: ['product_id'],
    message: 'Need product id',
  }
);

interface CreateProductRequestInterface {
  name: string;
  amount_available: number;
  cost: number;
}

interface EditProductRequestInterface {
  product_id: string;
  name: string;
  amount_available: number;
  cost: number;
}

function formDataToObject<T>(formData: FormData) {
  return Object.fromEntries((formData as any).entries()) as T;
}

export async function createProduct(
  state: FormState<CreateProductRequestInterface, undefined>,
  formData: FormData
) {
  const data = formDataToObject<CreateProductRequestInterface>(formData);
  const validatedFields = CreateProductFormSchema.safeParse(data);

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    return { errors };
  }

  const token = getSession();

  if (!token) throw new Error();

  const { errors } = await request('/products', 'POST', data, { token });

  if (errors) return { errors, data: null };

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function editProduct(
  state: FormState<CreateProductRequestInterface, undefined>,
  formData: FormData
) {
  const data = formDataToObject<EditProductRequestInterface>(formData);
  const validatedFields = EditProductFormSchema.safeParse(data);

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    return { errors };
  }

  const { product_id, ...requestData } = data;

  const token = getSession();

  if (!token) throw new Error();

  const { errors } = await request(
    '/products/' + product_id,
    'PATCH',
    requestData,
    {
      token,
    }
  );

  if (errors) return { errors, data: null };

  revalidatePath('/dashboard');
  revalidatePath('/');
  redirect('/dashboard');
}

export async function purchaseProducts(products: CartProductInterface[]) {
  const requestData = {
    products: products.map(({ _id, quantity }) => ({
      product_id: _id,
      quantity,
    })),
  };

  const token = getSession();
  if (!token) throw new Error();

  const { errors, data } = await request<ProductPurchaseResponseInterface>(
    '/buy',
    'POST',
    requestData,
    {
      token,
    }
  );

  if (errors) return { errors, data };

  revalidatePath('/dashboard');
  return { errors, data };
}
