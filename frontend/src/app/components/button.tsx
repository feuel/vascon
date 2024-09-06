import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}
export function Button({ loading = false, children, ...props }: ButtonProps) {
  return (
    <button
      disabled={loading}
      {...props}
      className={clsx(props.className, 'btn')}
    >
      {loading ? <LoaderCircle /> : children}
    </button>
  );
}

function LoaderCircle() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      className="h-5 w-5 animate-spin"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
