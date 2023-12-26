import EmptyState from "@/app/components/EmptyState";

import getCurrentUser from "@/app/actions/getCurrentUser";
import getListings from "@/app/actions/getListings";

import PropertiesClient from "./PropertiesClient";

const PropertiesPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <EmptyState
        title="اجازه دسترسی به این صفحه را ندارید"
        subtitle="به حساب کاربری خود وارد شوید"
      />
    );
  }

  const listings = await getListings({ author: currentUser._id });

  if (listings.length === 0) {
    return (
      <EmptyState
        title="هیج ملکی یافت نشد"
        subtitle="شما هنوز ملکی را اضافه نکرده اید!"
      />
    );
  }

  return <PropertiesClient listings={listings} currentUser={currentUser} />;
};

export default PropertiesPage;
