"use client";

import qs from "query-string";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { Range } from "react-date-range";
import { formatISO } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";

import useSearchModal from "@/app/hooks/useSearchModal";

import Modal from "./Modal";
import {
  Calendar,
  DayRange,
} from "@hassanmojab/react-modern-calendar-datepicker";
import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";

import Counter from "../inputs/Counter";
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import Heading from "../Heading";

enum STEPS {
  LOCATION = 0,
  DATE = 1,
  INFO = 2,
}

const SearchModal = () => {
  const router = useRouter();
  const searchModal = useSearchModal();
  const params = useSearchParams();

  const [step, setStep] = useState(STEPS.LOCATION);

  const [location, setLocation] = useState<CountrySelectValue>();
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [bathroomCount, setBathroomCount] = useState(1);
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [selectedDayRange, setSelectedDayRange] = useState<DayRange>({
    from: null,
    to: null,
  });

  const calendarRef = useRef();

  useEffect(() => {
    if (calendarRef.current) {
      const calendarContainer = calendarRef.current.querySelector(".Calendar");
      const calendarDay = calendarRef.current.querySelector(".Calendar__day");
      const calendarSectionWrapper = calendarRef.current.querySelector(
        ".Calendar__sectionWrapper"
      );
      const calendarHeader =
        calendarRef.current.querySelector(".Calendar__header");
      const calendarWeek = calendarRef.current.querySelector(
        ".Calendar__weekDays"
      );
      const calendarSection =
        calendarRef.current.querySelector(".Calendar__section");

      if (calendarContainer) {
        calendarContainer.style.paddingTop = "0px";
        calendarContainer.style.minHeight = "10.5em";
      }

      if (calendarDay) {
        calendarDay.style.marginBottom = "0px";
      }

      if (calendarSectionWrapper) {
        calendarSectionWrapper.style.minHeight = "16.8em";
      }

      if (calendarHeader) {
        calendarHeader.style.padding = "0em 2.9em";
      }

      if (calendarWeek) {
        calendarWeek.style.padding = "0 2.6em";
        calendarWeek.style.marginBottom = "0";
      }

      if (calendarSection) {
        calendarSection.style.paddingTop = "0";
      }
    }
  }, [step, searchModal.isOpen]);

  const Map = useMemo(
    () =>
      dynamic(() => import("../Map"), {
        ssr: false,
      }),
    [location]
  );

  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, []);

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);

  const onSubmit = useCallback(async () => {
    if (step !== STEPS.INFO) {
      return onNext();
    }

    let currentQuery = {};

    if (params) {
      currentQuery = qs.parse(params.toString());
    }

    const updatedQuery: any = {
      ...currentQuery,
      locationValue: location?.value,
      guestCount,
      roomCount,
      bathroomCount,
    };

    if (selectedDayRange.from) {
      updatedQuery.startDate = formatISO(
        new Date(
          selectedDayRange.from.year,
          selectedDayRange.from.month,
          selectedDayRange.from.day
        )
      );
    }

    if (selectedDayRange.to) {
      updatedQuery.endDate = formatISO(
        new Date(
          selectedDayRange.to.year,
          selectedDayRange.to.month,
          selectedDayRange.to.day
        )
      );
    }

    const url = qs.stringifyUrl(
      {
        url: "/",
        query: updatedQuery,
      },
      { skipNull: true }
    );

    setStep(STEPS.LOCATION);
    searchModal.onClose();
    router.push(url);
  }, [
    step,
    searchModal,
    location,
    router,
    guestCount,
    roomCount,
    dateRange,
    onNext,
    bathroomCount,
    params,
  ]);

  const actionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return "جستجو";
    }

    return "بعدی";
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.LOCATION) {
      return undefined;
    }

    return "قبلی";
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="مقصد خود را انتخاب کنید"
        subtitle="یک مکان عالی را انتخاب کنید!"
      />
      <CountrySelect
        value={location}
        onChange={(value) => setLocation(value as CountrySelectValue)}
      />

      <Map center={location?.latlng} />
    </div>
  );

  if (step === STEPS.DATE) {
    bodyContent = (
      <div ref={calendarRef} className="flex flex-col gap-4">
        <Heading
          title="بازه زمانی اقامت خود را مشخص کنید"
          subtitle="از وقت آزاد خود اطمینان حاصل کنید!"
        />
        <Calendar
          calendarClassName="!contents"
          locale={"fa"}
          shouldHighlightWeekends
          onChange={setSelectedDayRange}
          value={selectedDayRange}
        />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-4">
        <Heading title="اطلاعات بیشتر" subtitle="ملک عالی خود را پیدا کنید" />
        <Counter
          onChange={(value) => setGuestCount(value)}
          value={guestCount}
          title="مسافران"
          subtitle="تعداد مسافران"
        />
        <hr />
        <Counter
          onChange={(value) => setRoomCount(value)}
          value={roomCount}
          title="اتاق ها"
          subtitle="تعداد اتاق های مورد نیاز"
        />
        <hr />
        <Counter
          onChange={(value) => {
            setBathroomCount(value);
          }}
          value={bathroomCount}
          title="سرویس بهداشتی"
          subtitle="تعداد سرویس بهداشتی مورد نیاز"
        />
      </div>
    );
  }

  return (
    <Modal
      isOpen={searchModal.isOpen}
      title="فیلترها"
      actionLabel={actionLabel}
      onSubmit={onSubmit}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
      onClose={searchModal.onClose}
      body={bodyContent}
    />
  );
};

export default SearchModal;
