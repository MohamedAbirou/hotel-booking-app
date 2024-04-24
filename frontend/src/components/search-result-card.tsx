import { AiFillStar } from "react-icons/ai";
import { HotelType } from "../../../backend/src/shared/types";
import { Link } from "react-router-dom";

type Props = {
  hotel: HotelType;
};

export const SearchResultCard = ({ hotel }: Props) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] border border-slate-300 rounded-lg p-8 gap-8">
      <div className="w-full h-[300px]">
        <img
          src={hotel.imageUrls[5]}
          className="w-full h-full object-cover object-center"
          alt="hotel image"
        />
      </div>
      <div className="grid grid-rows-[1fr_2fr_1fr]">
        <div>
          <div className="flex items-center">
            <span className="flex">
              {Array.from({ length: hotel.starRating }).map(() => (
                <AiFillStar className="fill-yellow-400" />
              ))}
            </span>
            <span className="ml-1 text-sm">{hotel.type}</span>
          </div>
          <Link
            to={`/detail/${hotel._id}`}
            className="text-xl font-bold cursor-pointer"
          >
            {hotel.name}
          </Link>
        </div>

        <div>
          <div className="line-clamp-4">{hotel.description}</div>
        </div>

        <div className="flex justify-between items-end whitespace-nowrap">
          <div className="flex flex-wrap gap-1 items-center">
            {hotel.facilities.slice(0, 3).map((facility) => (
              <span
                key={facility}
                className="bg-slate-300 p-2 rounded-lg font-bold text-xs whitespace-nowrap"
              >
                {facility}
              </span>
            ))}
            <span className="text-sm">
              {hotel.facilities.length > 3 &&
                `+${hotel.facilities.length - 3} more`}
            </span>
          </div>
          <div className="flex flex-col w-fit items-end gap-1">
            <span className="font-bold">${hotel.pricePerNight} per night</span>
            <Link
              to={`/detail/${hotel._id}`}
              className="bg-blue-600 text-white h-full px-2.5 py-1 font-semibold text-lg rounded max-w-fit"
            >
              View More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
