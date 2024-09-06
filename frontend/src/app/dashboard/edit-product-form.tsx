'use client';
import { useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Label } from '../components/label';
import { Input } from '../components/input';
import { FieldError } from '../components/field-error';
import { Button } from '../components/button';
import { editProduct } from '../actions/product';
import { useFormErrors } from '../utils/hooks';
import { DollarSign } from 'react-feather';
import { ProductInterface } from '../types';

export function EditProductForm({ product }: { product: ProductInterface }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action] = useFormState(editProduct, undefined);
  const [errors] = useFormErrors(formRef, state?.errors);

  const { name, amount_available, cost } = product;

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-xl font-medium">Edit product</h1>
        <p className="text-sm text-gray-600 font-light">
          Update product information
        </p>
      </div>
      <form ref={formRef} action={action}>
        <input name="product_id" value={product._id} type="text" hidden />
        <div className="mb-5">
          <Label htmlFor="name">Product name</Label>
          <Input
            error={!!errors.name}
            placeholder="Name"
            name="name"
            id="name"
            defaultValue={name}
          />

          <FieldError error={errors.name} />
        </div>
        <div className="mb-5">
          <Label htmlFor="amount_available">Quantity</Label>
          <Input
            type="number"
            error={!!errors.amount_available}
            placeholder="Quantity"
            name="amount_available"
            id="amount_available"
            defaultValue={amount_available}
          />
          <FieldError error={errors.amount_available} />
        </div>
        <div className="mb-16">
          <Label htmlFor="cost">Cost</Label>
          <Input
            icon={DollarSign}
            error={!!errors.cost}
            placeholder="Cost"
            name="cost"
            id="cost"
            defaultValue={cost}
          />
          <FieldError error={errors.cost} />
        </div>
        <div>
          <CreateButton />
        </div>
      </form>
    </div>
  );
}

function CreateButton() {
  const { pending } = useFormStatus();
  return (
    <Button loading={pending} className="w-full">
      Edit
    </Button>
  );
}
