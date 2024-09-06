import clsx from 'clsx';
import { Icon } from 'react-feather';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: Icon;
  error?: boolean;
}

export function Input({
  icon: Icon,
  error,
  className,
  ...otherProps
}: InputProps) {
  return (
    <div className="relative w-full">
      {Icon && (
        <span className="absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none">
          <Icon className="h-5 w-5 text-gray-800" />
        </span>
      )}
      <input
        {...otherProps}
        className={clsx(
          className,
          'h-10 rounded-[6px] border w-full focus:outline-indigo-600 00 shadow-sm text-sm pr-3',
          Icon ? 'pl-10' : 'pl-3',
          error && 'border-red-500 focus:outline-red-500'
        )}
      />
    </div>
  );
}
