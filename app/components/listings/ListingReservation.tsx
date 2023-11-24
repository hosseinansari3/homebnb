"use client";

import { DateRange, Range } from "react-date-range";

import Button from "../Button";

import {
  Calendar,
  DayRange,
  DayValue,
  Day,
} from "@hassanmojab/react-modern-calendar-datepicker";
import localFont from "next/font/local";

const myFont = localFont({
  src: "../../../public/fonts/Vazirmatn-FD-Regular.woff2",
});

interface ListingReservationProps {
  price: number;
  dateRange: DayRange;
  totalPrice: number;
  onChangeDate: (value: DayRange) => void;
  onSubmit: () => void;
  disabled?: boolean;
  disabledDates: Day[];
}

const ListingReservation: React.FC<ListingReservationProps> = ({
  price,
  dateRange,
  totalPrice,
  onChangeDate,
  onSubmit,
  disabled,
  disabledDates,
}) => {
  return (
    <div
      className="
      bg-white 
        rounded-xl 
        border-[1px]
      border-neutral-200 
        overflow-hidden
      "
    >
      <div
        className="
      flex flex-row items-center gap-1 p-4"
      >
        <div className={`${myFont.className} text-2xl font-semibold`}>
          {price}
        </div>
        <div className="font-light text-neutral-600">تومان به ازای هر شب</div>
      </div>
      <hr />
      <Calendar
        calendarClassName="!contents"
        value={dateRange}
        onChange={onChangeDate}
        locale={"fa"}
        disabledDays={disabledDates}
        shouldHighlightWeekends
      />

      <hr />
      <div className="p-4">
        <Button disabled={disabled} label="Reserve" onClick={onSubmit} />
      </div>
      <hr />
      <div
        className={`${myFont.className} p-4 
          flex 
          flex-row 
          items-center 
          justify-between
          font-semibold
          text-lg`}
      >
        <div>قیمت کل</div>
        <div>{totalPrice}تومان</div>
      </div>
    </div>
  );
};

export default ListingReservation;
