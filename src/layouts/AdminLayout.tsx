import { valibotResolver } from '@hookform/resolvers/valibot';
import { useAuth } from 'hooks/useAuth';
import { useForm } from 'react-hook-form';
import { NavLink } from 'react-router-dom';
import { type Input, object, string, email } from 'valibot';

type Props = {
  children: React.ReactNode;
};

const LoginSchema = object({
  email: string([email()]),
  password: string(),
});

export const AdminLayout: React.FC<Props> = ({ children }) => {
  const { user, isInitialized, signIn, signOut } = useAuth();
  const { register, handleSubmit } = useForm<Input<typeof LoginSchema>>({
    resolver: valibotResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = handleSubmit(async ({ email, password }) => {
    try {
      await signIn(email, password);
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
        return;
      }

      throw err;
    }
  });

  if (!isInitialized) {
    return <div>logging in...</div>;
  }

  if (!user) {
    return (
      <div className="py-8">
        <form className="max-w-sm mx-auto grid gap-5" onSubmit={onSubmit}>
          <div className="grid gap-2">
            <h1 className="text-xl text-zinc-800 font-bold">
              Back Office Admin
            </h1>
            <p className="text-sm text-zinc-400">
              This page is only accessible to authorized users.
            </p>
          </div>
          <div className="grid gap-3">
            <input
              className="border rounded px-4 py-2"
              type="email"
              placeholder="Email"
              {...register('email')}
            />
            <input
              className="border rounded px-4 py-2"
              type="password"
              placeholder="Password"
              {...register('password')}
            />
          </div>
          <input
            className="border border-purple-900 bg-purple-700 text-white rounded px-4 py-2"
            type="submit"
            value="submit"
          />
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-8">
      <header className="flex items-center gap-x-4">
        <button className="border rounded px-4 py-2" onClick={() => signOut()}>
          Sign Out
        </button>
        <NavLink className="underline hover:underline" to="/admin">
          List
        </NavLink>
      </header>
      <main className="mt-8">{children}</main>
    </div>
  );
};
