import clsx from 'clsx';

export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      {...props}
      className={clsx(props.className, 'text-sm text-gray-700 leading-8')}
    >
      {props.children}
    </label>
  );
}
