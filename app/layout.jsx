import './globals.css';
import '../styles/neomorphism.css';

export const metadata = {
  title: 'EduPangan - Indramayu Smart Food Village',
  description: 'Panen Cerdas, Gizi Keluarga Terjaga',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
