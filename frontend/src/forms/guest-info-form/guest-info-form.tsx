import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { useSearchContext } from "../../contexts/search-context";
import { useAppContext } from "../../contexts/app-context";
import { useLocation, useNavigate } from "react-router-dom";
import { HotelType } from "../../../../backend/src/shared/types";
import { useMemo } from "react";
import { eachDayOfInterval } from "date-fns";

type Props = {
  hotel: HotelType;
  hotelId: string;
  pricePerNight: number;
};

type GuestInfoFormData = {
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
};

export const GuestInfoForm = ({ hotel, hotelId, pricePerNight }: Props) => {
  const { isLoggedIn } = useAppContext();
  const search = useSearchContext();
  const navigate = useNavigate();
  const location = useLocation();

  const bookings = hotel.bookings;

  const disabledDates = useMemo(() => {
    let dates: Date[] = [];

    bookings.forEach((booking) => {
      const range = eachDayOfInterval({
        start: new Date(booking.checkIn),
        end: new Date(booking.checkOut),
      });

      dates = [...dates, ...range];
    });

    return dates;
  }, [bookings]);

  const {
    watch,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GuestInfoFormData>({
    defaultValues: {
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      adultCount: search.adultCount,
      childCount: search.childCount,
    },
  });

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");

  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);

  const onSignInClick = (data: GuestInfoFormData) => {
    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.adultCount,
      data.childCount
    );
    navigate("/sign-in", { state: { from: location } });
  };

  const onSubmit = (data: GuestInfoFormData) => {
    search.saveSearchValues(
      "",
      data.checkIn,
      data.checkOut,
      data.adultCount,
      data.childCount
    );
    navigate(`/hotel/${hotelId}/booking`);
  };

  return (
    <div className="flex flex-col p-4 bg-blue-200 rounded-md gap-4">
      <h3 className="text-md font-bold">${pricePerNight}</h3>
      <form
        onSubmit={
          isLoggedIn ? handleSubmit(onSubmit) : handleSubmit(onSignInClick)
        }
      >
        <div className="grid grid-cols-1 gap-4 items-center">
          <div>
            <DatePicker
              selected={checkIn}
              onChange={(date) => setValue("checkIn", date as Date)}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={minDate}
              maxDate={maxDate}
              placeholderText="Check-in Date"
              className="min-w-full bg-white p-2 rounded-md focus:outline-none disabled:bg-gray-500"
              wrapperClassName="min-w-full"
              dateFormat={"dd-MM-YYYY"}
              excludeDates={disabledDates}
            />
          </div>
          <div>
            <DatePicker
              selected={checkOut}
              onChange={(date) => setValue("checkOut", date as Date)}
              selectsStart
              startDate={checkIn}
              endDate={checkOut}
              minDate={
                checkIn && new Date(checkIn.getTime() + 1000 * 60 * 60 * 24)
              }
              maxDate={maxDate}
              placeholderText="Check-out Date"
              className="min-w-full bg-white p-2 rounded-md focus:outline-none"
              wrapperClassName="min-w-full"
              dateFormat={"dd-MM-YYYY"}
              excludeDates={disabledDates}
            />
          </div>
          <div className="flex bg-white px-2 gap-2 rounded-md">
            <label htmlFor="adults" className="items-center flex">
              Adults:
              <input
                id="adults"
                type="number"
                className="w-full p-2 focus:outline-none font-semibold"
                min={1}
                max={20}
                {...register("adultCount", {
                  required: "This field is required",
                  min: {
                    value: 1,
                    message: "There must be at least one adult",
                  },
                  valueAsNumber: true,
                })}
              />
            </label>
            <label htmlFor="child" className="items-center flex">
              Children:
              <input
                id="child"
                type="number"
                className="w-full p-2 focus:outline-none font-semibold"
                min={0}
                max={20}
                {...register("childCount", {
                  valueAsNumber: true,
                })}
              />
            </label>
            {errors.adultCount && (
              <span className="text-red-500 font-semibold text-sm">
                {errors.adultCount.message}
              </span>
            )}
          </div>
          {isLoggedIn ? (
            <button className="bg-blue-600 text-white h-full p-2 rounded-md font-semibold hover:bg-blue-500 text-lg">
              Book Now
            </button>
          ) : (
            <button className="bg-blue-600 text-white h-full p-2 rounded-md font-semibold hover:bg-blue-500 text-lg">
              Sign in to Book
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
