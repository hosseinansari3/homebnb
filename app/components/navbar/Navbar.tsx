"use client";

import { SafeUser } from "@/app/types";
import Container from "../Container";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import User from "@/models/User";
import Categories from "./Categories";

interface NavbarProps {
  currentUser?: any | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
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
            <UserMenu currentUser={currentUser} />

            <Search />
            <Logo />
          </div>
        </Container>
      </div>
      <Categories />
    </div>
  );
};

export default Navbar;
