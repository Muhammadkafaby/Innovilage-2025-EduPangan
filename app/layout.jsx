import './globals.css';

export const metadata = {
  title: 'EduPangan - Indramayu Smart Food Village',
  description: 'Panen Cerdas, Gizi Keluarga Terjaga',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}
