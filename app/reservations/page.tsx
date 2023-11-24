import EmptyState from "@/app/components/EmptyState";

import getCurrentUser from "@/app/actions/getCurrentUser";
import getReservations from "@/app/actions/getReservations";

import TripsClient from "./ReservationsClient";

const ReservationsPage = async () => {
  const currentUser: any = await getCurrentUser();

  if (!currentUser) {
    return <EmptyState title="Unauthorized" subtitle="Please login" />;
  }

  const reservations: any = await getReservations({
    authorId: currentUser._id,
  });

  if (reservations?.length === 0) {
    return (
      <EmptyState
        title="ملک رزرو شده ای یافت نشد!"
        subtitle="هیچ یک از ملک های شما رزرو نشده است!"
      />
    );
  }

  return <TripsClient reservations={reservations} currentUser={currentUser} />;
};

export default ReservationsPage;
