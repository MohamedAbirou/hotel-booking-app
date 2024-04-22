import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/app-context";
import { Link } from "react-router-dom";
import { IoLocationSharp } from "react-icons/io5";
import { BsBuilding } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";

const MyHotels = () => {
  const { showToast } = useAppContext();
  const { data: hotelData } = useQuery(
    "fetchMyHotels",
    apiClient.fetchMyHotels,
    {
      onError: () => {
        showToast({ message: "", type: "ERROR" });
      },
    }
  );

  return (
    <div className="space-y-5">
      <span className="flex justify-between">
        <h1 className="text-2xl font-bold">My Hotels</h1>
        <Link
          to="/add-hotel"
          className="flex items-center bg-blue-600 text-white px-3 py-1 font-semibold rounded hover:bg-blue-700 transition-colors duration-200"
        >
          Add Hotel
        </Link>
      </span>
      <div className="flex flex-col gap-8">
        {hotelData?.length === 0 && (
          <div className="flex items-center justify-center mt-5">
            <span className="text-xl font-bold">No Hotels found.</span>
          </div>
        )}
        {hotelData?.map((hotel) => (
          <div
            key={hotel._id}
            className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5"
          >
            <h2 className="text-xl font-bold">{hotel.name}</h2>
            <div className="whitespace-pre-line">{hotel.description}</div>
            <div className="flex flex-wrap gap-2">
              <div className="border border-slate-300 rounded-md px-3 py-2 w-max flex items-center">
                <IoLocationSharp className="mr-1" />
                {hotel.city}, {hotel.country}
              </div>
              <div className="border border-slate-300 rounded-md px-3 py-2 w-max flex items-center">
                <BsBuilding className="mr-1" />
                {hotel.type}
              </div>
              <div className="border border-slate-300 rounded-md px-3 py-2 w-max flex items-center">
                <BiMoney className="mr-1" />${hotel.pricePerNight} per night
              </div>
              <div className="border border-slate-300 rounded-md px-3 py-2 w-max flex items-center">
                <BiHotel className="mr-1" />
                {hotel.adultCount} adults, {hotel.childCount} children
              </div>
              <div className="border border-slate-300 rounded-md px-3 py-2 w-max flex items-center">
                <BiStar className="mr-1" />
                <h1 className="text-md">{hotel.starRating} Star Rating</h1>
              </div>
            </div>
            <span className="flex justify-end">
              <Link
                to={`/edit-hotel/${hotel._id}`}
                className="flex items-center bg-blue-600 text-white px-3 py-1 font-semibold rounded hover:bg-blue-700 transition-colors duration-200"
              >
                View Details
              </Link>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyHotels;
