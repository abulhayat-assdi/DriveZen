import LoginForm from "./LoginForm";

export const metadata = { title: "Admin Login — Drive Zen" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const sp = await searchParams;
  const from = typeof sp.from === "string" ? sp.from : "/admin/dashboard";

  return (
    <main className="grid min-h-screen place-items-center bg-ink bg-grid px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-2xl font-extrabold text-gold">
            DZ
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight">
            Drive Zen Admin
          </h1>
          <p className="mt-1 text-sm text-muted">Sign in to your dashboard</p>
        </div>

        <div className="card rounded-2xl p-6 shadow-2xl">
          <LoginForm from={from} />

          <div className="mt-5 rounded-xl border border-line bg-ink-2/60 p-3 text-xs text-muted">
            <p className="mb-1 font-semibold text-muted/90">Demo credentials</p>
            <p>Email: <span className="text-fg">admin@drivezen.com</span></p>
            <p>Password: <span className="text-fg">admin123</span></p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-2">
          © {new Date().getFullYear()} Drive Zen · Premium Car Accessories
        </p>
      </div>
    </main>
  );
}
