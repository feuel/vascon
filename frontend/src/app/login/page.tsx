import { LoginForm } from './login-form';

export const metadata = {
  title: 'Vend | Login',
  description: 'Profile details',
};

export default function Page() {
  return (
    <div className="container mx-auto py-28">
      <div className="w-full max-w-[380px] mx-auto">
        <header className="mb-10">
          <h1 className="text-center text-4xl font-bold">Login</h1>
          <p className="text-center text-gray-500 leading-8">
            Securely sign into your account
          </p>
        </header>
        <LoginForm />
      </div>
    </div>
  );
}
