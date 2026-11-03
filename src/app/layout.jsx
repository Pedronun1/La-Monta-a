import React from 'react';

export const metadata = {
  title: 'Restaurante La Montaña | Cocina Castiza y Reservas en Moncloa, Madrid',
  description:
    'Restaurante La Montaña en C. del Rey Francisco, 28, Moncloa - Aravaca, 28008 Madrid. Especialistas en croquetas de jamón ibérico, huevos trufados, oreja a la plancha, cazón en adobo y cocina tradicional desde 1943.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-stone-950 text-stone-100 antialiased selection:bg-amber-500 selection:text-stone-950">
        {children}
      </body>
    </html>
  );
}
