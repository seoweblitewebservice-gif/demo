import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <div className="font-display text-6xl font-bold text-brand">404</div>
      <h1 className="mt-3 font-display text-2xl font-bold">This page wandered off the map</h1>
      <p className="mt-2 text-sm leading-relaxed text-mute">
        The URL doesn't match any tool or page. Try the tool directory or head back home.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/tools" className="btn btn-primary">Browse all tools</Link>
        <Link href="/" className="btn btn-ghost">Home</Link>
      </div>
    </div>
  );
}
