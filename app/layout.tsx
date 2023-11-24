import "./globals.css";
import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import Navbar from "./components/navbar/Navbar";
import Modal from "./components/modals/Modal";
import RegisterModal from "./components/modals/RegisterModal";
import ToasterProvider from "./providers/ToasterProvider";
import LoginModal from "./components/modals/LoginModal";
import getCurrentUser from "./actions/getCurrentUser";
import RentModal from "./components/modals/RentModal";
import SearchModal from "./components/modals/SearchModal";
import "next/font/local/";
import localFont from "next/font/local";

const myFont = localFont({
  src: "../public/fonts/Vazirmatn-FD-Black.ttf",
});
const vazir = Vazirmatn({ subsets: ["arabic"] });

export const metadata: Metadata = {
  title: "homebnb",
  description: "rent house all around the world",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();
  return (
    <html lang="fa" dir="rtl">
      <body className={vazir.className}>
        <ToasterProvider />
        <RegisterModal />
        <LoginModal />
        <SearchModal />
        <RentModal />
        <Navbar currentUser={currentUser} />
        <div className="pb-20 pt-28">{children}</div>
      </body>
    </html>
  );
}
