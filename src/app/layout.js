import '../index.css';

export const metadata = {
  title: "Nikhil's Portfolio",
  description: "Passionate React.js Developer crafting responsive, modern web experiences with precision.",
  icons: {
    icon: "/Favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/Favicon.svg" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
