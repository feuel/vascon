import { CreateForm } from './create-form';

export const metadata = {
  title: 'Vend | Create Account',
  description: 'Create a new account',
};

export default function Page() {
  return (
    <div className="container mx-a py-28">
      <div className="w-full max-w-[380px] mx-auto">
        <header className="mb-10">
          <h1 className="text-center text-4xl font-bold">Sign Up</h1>
          <p className="text-center text-gray-500 leading-8">
            Get started by creating an account
          </p>
        </header>
        <CreateForm />
      </div>
    </div>
  );
}
