import "./globals.css";
import Nav from "@/components/Nav";

export const metadata = {
  title: "React Book | Open Library discovery",
  description: "A warm, open book discovery platform powered by synced Open Library data."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
