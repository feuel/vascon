import React from 'react';
import { Icon } from 'react-feather';

interface AccountTypeSelectorProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: Icon;
  title: string;
}

export function AccountTypeSelector({
  icon: IconComponent,
  title,
  ...props
}: AccountTypeSelectorProps) {
  return (
    <label className="w-full flex items-center gap-x-1.5 relative border shadow-sm py-3 px-4 rounded-md text-sm">
      <input
        type="radio"
        {...props}
        className="peer absolute collapse opacity-0"
      />
      <span className="mr-2 inline-block h-6 w-6 border rounded-full peer-checked:border-[7px] peer-checked:border-indigo-600"></span>
      <IconComponent className="h-5 w-5 text-gray-500" />
      {title}
    </label>
  );
}
