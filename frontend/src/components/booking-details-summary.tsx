import { HotelType } from "../../../backend/src/shared/types";

type Props = {
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
  numberOfNights: number;
  hotel: HotelType;
};

export const BookingDetailsSummary = ({
  checkIn,
  checkOut,
  adultCount,
  childCount,
  numberOfNights,
  hotel,
}: Props) => {
  return (
    <div className="grid gap-4 rounded-lg border border-slate-300 p-5 h-fit">
      <h2 className="text-xl font-bold">Your Booking Details</h2>
      <div className="border-b py-2">
        Location:
        <div className="font-semibold">{`${hotel.name}, ${hotel.city}, ${hotel.country}`}</div>
      </div>
      <div className="flex justify-between">
        <div>
          Check-in
          <div className="font-semibold">{checkIn.toDateString()}</div>
        </div>
        <div>
          Check-out
          <div className="font-semibold">{checkOut.toDateString()}</div>
        </div>
      </div>
      <div className="border-t border-b py-2">
        Total length of stay:
        <div className="font-semibold">{numberOfNights} nights</div>
      </div>

      <div>
        Guests
        <div className="font-semibold">
          {adultCount} adults & {childCount} children
        </div>
      </div>
    </div>
  );
};
