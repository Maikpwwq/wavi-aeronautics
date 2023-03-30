import "./globals.css";
// import Navigation from "./components/Navigation";
import Providers from "./providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      <body>
        <Providers>
          {/* <Navigation /> */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
