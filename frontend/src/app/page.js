import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-200 via-zinc-300 to-zinc-400 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-700 font-sans">
      <main className="flex flex-col items-center justify-center gap-6 p-8 bg-zinc-100/80 dark:bg-zinc-900/60 backdrop-blur-md rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] border border-zinc-300/50 dark:border-zinc-700/50">
        
        <h1 className="text-4xl font-bold text-zinc-800 dark:text-zinc-100">
          Welcome
        </h1>

        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Please log in or sign up to continue.
        </p>

        <div className="flex gap-4">
          <Link
            href="/login"
            className="flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-zinc-700 to-zinc-500 px-6 text-white transition-all hover:from-zinc-800 hover:to-zinc-600 md:w-auto"
          >
            Log In
          </Link>

          <Link
            href="/signup"
            className="flex h-12 w-full items-center justify-center rounded-full border border-zinc-500 text-zinc-700 dark:text-zinc-200 px-6 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800 md:w-auto"
          >
            Sign Up
          </Link>
        </div>
      </main>
    </div>
  );
}
