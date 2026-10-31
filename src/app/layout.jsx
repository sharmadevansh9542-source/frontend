import '../index.css';
import Providers from './providers';

export const metadata = {
  title: 'HMS+ | Hospital Management System',
  description: 'Hospital management portals for administrators, doctors, and patients.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
