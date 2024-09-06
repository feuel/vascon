'use client';
import { RefObject, useCallback, useEffect, useState } from 'react';

export function useFormErrors(
  formRef: RefObject<HTMLFormElement>,
  formStateErrors: any
) {
  const [errors, setErrors] = useState(formStateErrors || {});

  const handleChange = useCallback(
    (e: any) => {
      const name = (e.target as HTMLInputElement).name;
      const errorsCopy = { ...errors };
      delete errorsCopy[name];
      setErrors(errorsCopy);
    },
    [errors]
  );

  useEffect(() => {
    const form = formRef.current;
    const errors = formStateErrors || {};
    const keys = Object.keys(errors);
    if (formStateErrors && form) {
      const inputs = Array.from(form.querySelectorAll('input'));
      const input = inputs.find((input) => keys.includes(input.name));
      input && input.focus();
    }
    setErrors(errors);
  }, [formStateErrors]);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    form.addEventListener('input', handleChange);
    return () => form?.removeEventListener('input', handleChange);
  }, [handleChange]);

  return [errors, setErrors];
}
