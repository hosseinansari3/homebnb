"use client";

import { TbBeach, TbMountain, TbPool } from "react-icons/tb";
import {
  GiBarn,
  GiBoatFishing,
  GiCactus,
  GiCastle,
  GiCaveEntrance,
  GiForestCamp,
  GiIsland,
  GiWindmill,
} from "react-icons/gi";
import { FaSkiing } from "react-icons/fa";
import { BsSnow } from "react-icons/bs";
import { IoDiamond } from "react-icons/io5";
import { MdOutlineVilla } from "react-icons/md";
import Container from "../Container";
import CategoryBox from "../CategortBox";
import { usePathname, useSearchParams } from "next/navigation";

export const categories = [
  {
    label: "ساحلی",
    icon: TbBeach,
    description: "این ملک در نزدیکی ساحل قرار دارد!",
  },
  {
    label: "آسیاب بادی",
    icon: GiWindmill,
    description: "این ملک دارای آسیاب بادی است!",
  },
  {
    label: "مدرن",
    icon: MdOutlineVilla,
    description: "این ملک مدرن است",
  },
  {
    label: "حومه شهر",
    icon: TbMountain,
    description: "این ملک در حومه شهر قرار دارد",
  },
  {
    label: "استخر",
    icon: TbPool,
    description: "این ملک دارای استخر است",
  },
  {
    label: "جزیره",
    icon: GiIsland,
    description: "این ملک در جزیره قرار دارد!",
  },
  {
    label: "دریاچه",
    icon: GiBoatFishing,
    description: "!این ملک در کنار دریاچه است",
  },
  {
    label: "اسکی",
    icon: FaSkiing,
    description: "این ملک دارای امکانات اسکی است!",
  },
  {
    label: "قلعه",
    icon: GiCastle,
    description: "این ملک یک قلعه باستانی است!",
  },
  {
    label: "غار",
    icon: GiCaveEntrance,
    description: "این ملک درون غار قرار دارد!",
  },
  {
    label: "کمپینگ",
    icon: GiForestCamp,
    description: "این ملک امکانات کمپینگ را ارائه می دهد",
  },
  {
    label: "قطبی",
    icon: BsSnow,
    description: "این ملک در قطب شمال قرار دارد!",
  },
  {
    label: "بیابانی",
    icon: GiCactus,
    description: "این یک ملک بیابانی است!",
  },
  {
    label: "مزرعه",
    icon: GiBarn,
    description: "این ملک در یک مزرعه قرار دارد!",
  },
  {
    label: "لوکس",
    icon: IoDiamond,
    description: "این یک ملک لوکس است!",
  },
];

const Categories = () => {
  const params = useSearchParams();
  const category = params?.get("category");
  const pathname = usePathname();
  const isMainPage = pathname === "/";

  if (!isMainPage) {
    return null;
  }

  return (
    <Container>
      <div
        className="
             pt-4
             flex 
             flex-row 
             items-center 
             justify-between
             overflow-x-auto
           "
      >
        {categories.map((item) => (
          <CategoryBox
            key={item.label}
            label={item.label}
            icon={item.icon}
            selected={category === item.label}
          />
        ))}
      </div>
    </Container>
  );
};

export default Categories;
