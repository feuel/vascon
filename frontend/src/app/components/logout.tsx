'use client';

import { logout } from '../actions/auth';

export function Logout({ username }: { username: string }) {
  return (
    <button
      className="flex items-center justify-center rounded-full text-[13px] border h-[25px] px-2 text-gray-500"
      onClick={() => logout(username)}
    >
      Logout {username}
    </button>
  );
}
