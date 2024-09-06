import clsx from 'clsx';

interface FieldErrorProps extends React.HTMLAttributes<HTMLSpanElement> {
  error?: string | undefined | null;
}
export function FieldError({ error, ...props }: FieldErrorProps) {
  if (!error) return;
  return (
    <span
      {...props}
      className={clsx(props.className, 'text-[12px] text-red-500 mt-1')}
    >
      {error}
    </span>
  );
}
