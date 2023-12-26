"use client";

import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Range } from "react-date-range";
import { useRouter } from "next/navigation";
import { differenceInDays, eachDayOfInterval } from "date-fns";

import useLoginModal from "@/app/hooks/useLoginModal";

import Container from "@/app/components/Container";
import { categories } from "@/app/components/navbar/Categories";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import ListingReservation from "@/app/components/listings/ListingReservation";

import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { DayRange } from "@hassanmojab/react-modern-calendar-datepicker";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

interface ListingClientProps {
  reservations?: any[];
  listing: any & {
    user: any;
  };
  currentUser?: any | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  reservations = [],
  currentUser,
}) => {
  const loginModal = useLoginModal();
  const router = useRouter();

  const disabledDates = useMemo(() => {
    let dates: Date[] = [];
    let dates2: any[] = [];

    reservations.forEach((reservation: any) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate),
      });

      dates = [...dates, ...range];
    });
    console.log("disabledDates", dates);

    dates.forEach((date: Date) => {
      const dateObj = {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate(),
      };
      dates2 = [...dates2, dateObj];
    });

    console.log("disabledDates22", dates2);

    return dates2;
  }, [reservations]);

  const category = useMemo(() => {
    return categories.find((items) => items.label === listing.category);
  }, [listing.category]);

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);
  const [selectedDayRange, setSelectedDayRange] = useState<DayRange>({
    from: null,
    to: null,
  });

  useEffect(() => {
    console.log("startDate", dateRange?.startDate);
    console.log(
      "startDatePersian",
      new Date(
        selectedDayRange?.from?.year,
        selectedDayRange?.from?.month,
        selectedDayRange?.from?.day
      )
    );
  }, [dateRange, selectedDayRange]);
  const onCreateReservation = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }
    setIsLoading(true);

    axios
      .post("/api/reservations", {
        totalPrice,
        startDate: new Date(
          selectedDayRange?.from?.year,
          selectedDayRange?.from?.month,
          selectedDayRange?.from?.day
        ),
        endDate: new Date(
          selectedDayRange?.to?.year,
          selectedDayRange?.to?.month,
          selectedDayRange?.to?.day
        ),
        listingId: listing?._id,
      })
      .then(() => {
        toast.success("ملک رزرو شد!");
        setDateRange(initialDateRange);
        router.push("/trips");
      })
      .catch(() => {
        toast.error("Something went wrong.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [
    totalPrice,
    dateRange,
    selectedDayRange,
    listing?._id,
    router,
    currentUser,
    loginModal,
  ]);

  useEffect(() => {
    if (selectedDayRange?.to && selectedDayRange?.from) {
      const dayCount = differenceInDays(
        new Date(
          selectedDayRange?.to?.year,
          selectedDayRange?.to?.month,
          selectedDayRange?.to?.day
        ),
        new Date(
          selectedDayRange?.from?.year,
          selectedDayRange?.from?.month,
          selectedDayRange?.from?.day
        )
      );

      if (dayCount && listing.price) {
        setTotalPrice(dayCount * listing.price);
      } else {
        setTotalPrice(listing.price);
      }
    }
  }, [dateRange, selectedDayRange, listing.price]);

  return (
    <Container>
      <div
        className="
          max-w-screen-lg 
          mx-auto
        "
      >
        <div className="flex flex-col gap-6">
          <ListingHead
            title={listing.title}
            imageSrc={listing.imageSrc}
            locationLabel={listing.locationLabel}
            id={listing._id}
            currentUser={currentUser}
          />
          <div
            className="
              grid 
              grid-cols-1 
              md:grid-cols-7 
              md:gap-10 
              mt-6
            "
          >
            <ListingInfo
              user={listing.user}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              bathroomCount={listing.bathroomCount}
              locationLabel={listing.locationLabel}
            />
            <div
              className="
                order-first 
                mb-10 
                md:order-last 
                md:col-span-3
              "
            >
              <ListingReservation
                price={listing.price}
                totalPrice={totalPrice}
                onChangeDate={setSelectedDayRange}
                dateRange={selectedDayRange}
                onSubmit={onCreateReservation}
                disabled={isLoading}
                disabledDates={disabledDates}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ListingClient;
