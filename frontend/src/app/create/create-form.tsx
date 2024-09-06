'use client';

import { AtSign, Lock, ShoppingBag, ShoppingCart } from 'react-feather';
import {
  AccountTypeSelector,
  Button,
  FieldError,
  Input,
  Label,
} from '../components';
import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { signup } from '../actions/auth';
import { useRef } from 'react';
import { useFormErrors } from '../utils/hooks';

export function CreateForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action] = useFormState(signup, undefined);
  const [errors] = useFormErrors(formRef, state?.errors);

  return (
    <form ref={formRef} action={action}>
      <div className="mb-5">
        <Label htmlFor="role">Account type</Label>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <div className="flex-grow">
            <AccountTypeSelector
              icon={ShoppingBag}
              title="Seller"
              value="seller"
              name="role"
              defaultChecked
            />
          </div>
          <div className="flex-grow">
            <AccountTypeSelector
              icon={ShoppingCart}
              title="Buyer"
              value="buyer"
              name="role"
            />
          </div>
        </div>
      </div>
      <div className="flex mb-5 gap-x-5">
        <div className="flex-1">
          <Label htmlFor="first_name">Your name</Label>
          <Input
            error={!!errors.first_name}
            placeholder="Your name"
            name="first_name"
            id="first_name"
          />
          <FieldError error={errors.first_name} />
        </div>
        <div className="flex-1">
          <Label htmlFor="last_name">Surname</Label>
          <Input
            error={!!errors.last_name}
            placeholder="Surname"
            name="last_name"
            id="last_name"
          />
          <FieldError error={errors.last_name} />
        </div>
      </div>
      <div className="mb-5">
        <Label htmlFor="username">Username</Label>
        <Input
          error={!!errors.username}
          icon={AtSign}
          placeholder="Username"
          name="username"
          id="username"
        />
        <FieldError error={errors.username} />
      </div>
      <div className="mb-5">
        <Label htmlFor="password">Password</Label>
        <Input
          error={!!errors.password}
          icon={Lock}
          placeholder="Password"
          name="password"
          type="password"
          id="password"
        />
        <FieldError
          error={
            errors.password && `Password must ${errors.password.join(', ')}`
          }
        />
      </div>
      <div className="mb-10">
        <Label htmlFor="retry_password">Retype password</Label>
        <Input
          error={!!errors.retry_password}
          icon={Lock}
          placeholder="Retype password"
          name="retry_password"
          id="retry_password"
          type="password"
        />

        <FieldError error={errors.retry_password} />
      </div>
      <div className="mb-8">
        <SignupButton />
      </div>
      <div className="text-center text-sm text-gray-700">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-indigo-600">
          Login
        </Link>
      </div>
    </form>
  );
}

function SignupButton() {
  const { pending } = useFormStatus();
  return (
    <Button loading={pending} className="w-full">
      Sign up
    </Button>
  );
}
