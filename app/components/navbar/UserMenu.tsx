"use client";

import useRegisterModal from "@/app/hooks/useRegisterModal";
import { useCallback, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "../Avatar";
import MenuItem from "./MenuItem";
import useLoginModal from "@/app/hooks/useLoginModal";
import { signOut } from "next-auth/react";
import { SafeUser } from "@/app/types";
import User from "@/models/User";
import useRentModal from "@/app/hooks/useRentModal";
import { useRouter } from "next/navigation";

interface UserMenuProps {
  currentUser?: any | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const router = useRouter();

  const registerModal = useRegisterModal();
  const rentModal = useRentModal();
  const loginModal = useLoginModal();
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const onRent = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    rentModal.onOpen();
  }, [loginModal, currentUser]);

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={onRent}
          className="
            hidden
            md:block
            text-sm 
            font-semibold 
            py-3 
            px-4 
            rounded-full 
            hover:bg-neutral-100 
            transition 
            cursor-pointer
          "
        >
          خانه خود را اجاره دهید
        </div>
        <div
          onClick={toggleOpen}
          className="
          p-4
          md:py-1
          md:px-2
          border-[1px] 
          border-neutral-200 
          flex 
          flex-row 
          items-center 
          gap-3 
          rounded-full 
          cursor-pointer 
          hover:shadow-md 
          transition
          "
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            <Avatar src={currentUser?.image} />
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className="
            absolute 
            rounded-xl 
            shadow-md
            w-[40vw]
            md:w-3/4 
            bg-white 
            overflow-hidden 
            right-0 
            top-12 
            text-sm
          "
        >
          <div className="flex flex-col cursor-pointer">
            <>
              {currentUser ? (
                <>
                  <MenuItem
                    label="سفرهای من"
                    onClick={() => router.push("/trips")}
                  />
                  <MenuItem
                    label="علاقه مندی ها"
                    onClick={() => router.push("/favorites")}
                  />
                  <MenuItem
                    label="ملک های رزرو شده من"
                    onClick={() => router.push("/reservations")}
                  />
                  <MenuItem
                    label="ملک های من"
                    onClick={() => router.push("/properties")}
                  />
                  <MenuItem
                    label="خانه خود را اجاره دهید"
                    onClick={rentModal.onOpen}
                  />
                  <hr />
                  <MenuItem label="خروج" onClick={() => signOut()} />
                </>
              ) : (
                <>
                  <MenuItem
                    label="ورود به حساب کاربری"
                    onClick={loginModal.onOpen}
                  />
                  <MenuItem label="ثبت نام" onClick={registerModal.onOpen} />
                </>
              )}
            </>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
