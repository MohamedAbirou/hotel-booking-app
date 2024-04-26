import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { BookingCard } from "../components/booking-card";
import { useAppContext } from "../contexts/app-context";

const MyBookings = () => {
  const { showToast } = useAppContext();
  const { data: hotels } = useQuery(
    "fetchBookingsByUser",
    apiClient.fetchBookingsByUser,
    {
      onError: () => {
        showToast({ message: "Error fetching user's bookings", type: "ERROR" });
      },
    }
  );

  if (!hotels || hotels.length === 0) {
    return (
      <div className="flex items-center justify-center text-black">
        <p className="text-xl font-semibold">No bookings found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Bookings</h1>
      {hotels.map((hotel) => (
        <BookingCard key={hotel._id} hotel={hotel} />
      ))}
    </div>
  );
};

export default MyBookings;
