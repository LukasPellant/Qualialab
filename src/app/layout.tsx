// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'My 3D Canvas Portfolio',
  description: 'A personal website built with React, Three.js and WebGL',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ margin: 0, padding: 0, height: '100%', width: '100%' }}>
      <head>
        {/* Preload fonts for Three.js Text component */}
        <link
          rel="preload"
          href="/fonts/roboto.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body style={{ margin: 0, padding: 0, height: '100vh', width: '100vw', overflow: 'hidden' }}>{children}</body>
    </html>
  );
}