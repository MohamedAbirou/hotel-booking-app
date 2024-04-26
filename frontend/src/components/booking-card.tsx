import { HotelType } from "../../../backend/src/shared/types";

type Props = {
  hotel: HotelType;
};

export const BookingCard = ({ hotel }: Props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] border border-slate-300 rounded-lg p-8 gap-5">
      <div className="w-full h-[250px]">
        <img
          src={hotel.imageUrls[0]}
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px]">
        <div className="text-xl font-bold">
          {hotel.name}
          <div className="text-xs font-normal">
            {hotel.city}, {hotel.country}
          </div>
        </div>
        {hotel.bookings.map((booking) => (
          <div key={booking._id}>
            <div>
              <span className="font-bold mr-2">Dates: </span>
              <span>
                {new Date(booking.checkIn).toDateString()} -
                {new Date(booking.checkOut).toDateString()}
              </span>
            </div>
            <div>
              <span className="font-bold mr-2">Guests:</span>
              <span>
                {booking.adultCount} adults, {booking.childCount} children
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
