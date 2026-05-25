import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        padding: "2rem",
        backgroundColor: "var(--color-bg-primary)",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: 700,
          color: "var(--color-text-primary)",
          margin: 0,
        }}
      >
        DateSpark
      </h1>
      <p
        style={{
          fontSize: "1.125rem",
          color: "var(--color-text-secondary)",
          margin: 0,
        }}
      >
        Find your spark
      </p>
      <Link
        href="/settings"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.75rem 1.5rem",
          backgroundColor: "var(--color-accent)",
          color: "#ffffff",
          borderRadius: "0.75rem",
          textDecoration: "none",
          fontWeight: 500,
          fontSize: "0.875rem",
          transition: "background-color 0.15s ease",
        }}
      >
        Settings
      </Link>
    </main>
  );
}
