'use client';
import { useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { Label } from '../components/label';
import { Input } from '../components/input';
import { FieldError } from '../components/field-error';
import { Button } from '../components/button';
import { createProduct } from '../actions/product';
import { useFormErrors } from '../utils/hooks';
import { DollarSign } from 'react-feather';

export function CreateProduct() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action] = useFormState(createProduct, undefined);
  const [errors] = useFormErrors(formRef, state?.errors);

  return (
    <div>
      <h1 className="text-xl font-medium mb-10">Add a product</h1>
      <form ref={formRef} action={action}>
        <div className="mb-5">
          <Label htmlFor="name">Product name</Label>
          <Input
            error={!!errors.name}
            placeholder="Name"
            name="name"
            id="name"
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
      Create
    </Button>
  );
}
