import Link from 'next/link';

export function Logo({ page }: { page: string }) {
  return (
    <span className="flex items-center gap-x-3">
      <Link href="/" className="font-semibold text-lg">
        Vend
      </Link>
      <hr className="h-[20px] border-l " />
      <span className="italic font-light text-gray-500 text-md">{page}</span>
    </span>
  );
}
