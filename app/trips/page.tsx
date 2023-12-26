import EmptyState from "@/app/components/EmptyState";

import getCurrentUser from "@/app/actions/getCurrentUser";
import getReservations from "@/app/actions/getReservations";

import TripsClient from "./TripsClient";

const TripsPage = async () => {
  const currentUser: any = await getCurrentUser();

  if (!currentUser) {
    return (
      <EmptyState
        title="اجازه دسترسی به این صفحه را ندارید"
        subtitle="به حساب کاربری خود وارد شوید"
      />
    );
  }

  const reservations = await getReservations({ userId: currentUser._id });

  {
    reservations?.map((reservation: any) =>
      console.log("REZZI", reservation.listings)
    );
  }

  if (reservations?.length === 0) {
    return (
      <EmptyState
        title="سفری یافت نشد"
        subtitle="شما تاکنون هیچ ملکی را رزرو نکرده اید"
      />
    );
  }

  return <TripsClient reservations={reservations} currentUser={currentUser} />;
};

export default TripsPage;
