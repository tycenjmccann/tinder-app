export const metadata = {
  title: 'Tinder App',
  description: 'Tinder-like dating application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
