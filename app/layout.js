import "../styles/globals.css";
import Navbar from "../components/Navbar"

export const metadata = {
  title: 'Check If Michael Is Fat',
  description: 'Enjoy seeing whether Michael is getting fatter or not',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar></Navbar>
        {children}
      </body>
    </html>
  );
}
