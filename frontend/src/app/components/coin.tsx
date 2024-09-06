export function Coin({ amount }: { amount: number }) {
  return (
    <div className="coin">
      <span>{amount}</span>
    </div>
  );
}
