import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">Workflow App</h1>
      <p className="text-gray-600 mb-8">Manage your workflows efficiently.</p>
      <Link
        href="/workflow"
        className="rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors"
      >
        Go to Workflow Board
      </Link>
    </main>
  );
}
