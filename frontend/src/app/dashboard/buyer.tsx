import { UserCoins } from '../components/user-coins';
import { UserInterface } from '../types';

export function Buyer({ user }: { user: UserInterface }) {
  return (
    <div>
      <div className="py-20">
        <div className="flex justify-center">
          <UserCoins coins={user.deposit} />
        </div>
      </div>
    </div>
  );
}
