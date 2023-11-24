import getCurrentUser from "./actions/getCurrentUser";
import getListings, { IListingsParams } from "@/app/actions/getListings";
import Container from "./components/Container";
import EmptyState from "./components/EmptyState";
import ListingCard from "./components/listings/ListingCard";

interface HomeProps {
  searchParams: IListingsParams;
}

export default async function Home({ searchParams }: HomeProps) {
  const currentUser: any = await getCurrentUser();

  const dmsToDd = (value: string) => {
    // Use the regular expression to extract values
    const dmsRegex = /(\d+)\s*°\s*(\d+)'\s*([\d.]+)"/;

    const match = value.match(dmsRegex);

    if (match) {
      // Extract degrees, minutes, and seconds
      const degrees = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      const seconds = parseFloat(match[3]);

      const ddValue = degrees + minutes / 60 + seconds / 3600;

      return `${ddValue}`;
    } else {
      console.log("Invalid DMS format.");
    }
  };

  console.log("LAAAANG", dmsToDd("34° 31' 24.924\""));
  const listings = await getListings(searchParams);

  if (listings.length == 0) {
    return <EmptyState showReset />;
  }

  return (
    <Container>
      <div
        className="
        pt-24
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4
        xl:grid-cols-5
        2xl:grid-cols-6
        gap-8
      "
      >
        {listings.map((listing: any) => (
          <ListingCard
            currentUser={currentUser}
            key={listing.id}
            data={listing}
          />
        ))}
      </div>
    </Container>
  );
}
