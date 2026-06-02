import '../index.css';
import SmoothScroll from '../components/SmoothScroll';
import TelemetryTracker from '../components/TelemetryTracker';

export const metadata = {
  title: "Nikhil's Portfolio",
  description: "Passionate React.js Developer crafting responsive, modern web experiences with precision.",
  icons: {
    icon: "/Favicon.svg",
  },
  verification: {
    google: "4-KBDD679JwO9SrJ2YsLjd14t19Gi5uNkFEd0Fqm_o8",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/Favicon.svg" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var theme = localStorage.getItem('theme');
              if (theme === 'dark' || (!theme && true)) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            })();
          `
        }} />
      </head>
      <body className="antialiased font-sans">
        <TelemetryTracker />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
