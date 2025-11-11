import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center justify-center gap-6 p-8 bg-white dark:bg-black rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-black dark:text-zinc-50">Welcome</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">Please log in or sign up to continue.</p>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="flex h-12 w-full items-center justify-center rounded-full bg-blue-600 px-6 text-white transition-colors hover:bg-blue-700 md:w-auto"
          >
            Log In
          </Link>
          
          <Link href="/signup"
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-blue-600 px-6 text-blue-600 transition-colors hover:bg-blue-50 md:w-auto">
              Sign Up
          </Link>
        </div>
      </main>
    </div>
  );
}
