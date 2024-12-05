import "../styles/globals.css";
import Navbar from "../components/Navbar"

export const metadata = {
  title: 'My Health App',
  description: 'Track your health and fitness data easily with data visualizations and trends.',
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
