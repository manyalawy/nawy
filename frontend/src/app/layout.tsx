import type { Metadata } from 'next';
import { StyledComponentsRegistry } from '@/lib/registry';
import { ThemeProvider } from '@/styles/ThemeProvider';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Nawy - Find Your Dream Apartment',
  description: 'Browse and discover premium apartments across Egypt',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StyledComponentsRegistry>
          <ThemeProvider>
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
