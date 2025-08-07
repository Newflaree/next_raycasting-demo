// components/layouts/DefaultLayout.tsx
import { ReactNode } from "react";

interface DefaultLayoutProps {
  children: ReactNode;
}

export function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div style={{ backgroundColor: "#000", color: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ padding: "1rem", borderBottom: "1px solid #444" }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem" }}>DOOM Engine</h1>
      </header>

      <main style={{ flex: 1, padding: "1rem" }}>
        {children}
      </main>

      <footer style={{ padding: "1rem", borderTop: "1px solid #444", textAlign: "center", fontSize: "0.875rem" }}>
        © {new Date().getFullYear()} Powered by raycasting + Next.js
      </footer>
    </div>
  );
}
