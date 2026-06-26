import { tagline } from "@/lib/tagline";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <h1 className="max-w-md text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {tagline}
      </h1>
    </main>
  );
}
