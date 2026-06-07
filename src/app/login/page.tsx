import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black text-ink">Sign in</h1>
      <p className="mb-5 mt-2 text-stone-700">Use a magic link to manage vendor listings or admin approvals.</p>
      <LoginForm />
    </main>
  );
}
