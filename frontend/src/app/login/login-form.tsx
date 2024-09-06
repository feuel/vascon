'use client';

import { AtSign, Lock, LogOut } from 'react-feather';
import { Button, FieldError, Input, Label } from '../components';
import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { useRef } from 'react';
import { useFormErrors } from '../utils/hooks';
import { login, logout } from '../actions/auth';

export function LoginForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const username = useRef('');

  const [state, action] = useFormState(login, undefined);
  const [errors, setErrors] = useFormErrors(formRef, state?.errors);

  const isActiveSessionError = errors?.username
    ?.join('')
    .includes('active session');

  async function onLogout() {
    const errorsCopy = { ...errors };
    delete errorsCopy.username;
    await logout(username.current);
    setErrors(errorsCopy);
  }

  return (
    <form ref={formRef} action={action}>
      <div className="mb-5">
        <Label htmlFor="username">Username</Label>
        <Input
          onChange={(e) => (username.current = e.target.value)}
          error={!!errors.username}
          icon={AtSign}
          placeholder="Username"
          name="username"
          id="username"
        />
        <FieldError error={errors.username} />
        {isActiveSessionError && (
          <div className="flex justify-end mt-2">
            <button
              onClick={onLogout}
              className="flex items-center text-[13px] text-red-600"
              type="button"
            >
              <LogOut className="h-[14px] w-[14px] mr-1" />
              Logout all
            </button>
          </div>
        )}
      </div>
      <div className="mb-10">
        <Label htmlFor="password">Password</Label>
        <Input
          error={!!errors.password}
          icon={Lock}
          placeholder="Password"
          name="password"
          type="password"
          id="password"
        />
        <FieldError error={errors.password} />
      </div>
      <div className="mb-8">
        <LoginButton />
      </div>
      <div className="text-center text-sm text-gray-700">
        Don&apos;t have an account?{' '}
        <Link href="/create" className="font-medium text-indigo-600">
          Create
        </Link>
      </div>
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button loading={pending} className="w-full">
      Login
    </Button>
  );
}
