import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Central de Materiais · Nathan Wexel",
  description:
    "Todo material que já entreguei em reels e carrossel, num lugar só. Escolhe o vídeo e resgata o passo a passo.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
