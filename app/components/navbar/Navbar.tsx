"use client";

import Container from "../Container";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import User from "@/models/User";

interface NavbarProps {
  currentUser?: typeof User | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  console.log("user: ", currentUser);
  return (
    <div className="fixed w-full bg-white z-10 shaddow-sm">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div
            className="
            flex 
            flex-row 
            items-center 
            justify-between
            gap-3
            md:gap-0
          "
          >
            <Logo />
            <Search />
            <UserMenu />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Navbar;
