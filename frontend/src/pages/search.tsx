import { useQuery } from "react-query";
import { useSearchContext } from "../contexts/search-context";
import * as apiClient from "../api-client";
import { useState } from "react";
import { SearchResultCard } from "../components/search-result-card";
import { Pagination } from "../components/pagination";
import { StarRatingFilter } from "../components/star-rating-filter";
import { TypesFilter } from "../components/types-filter";
import { FacilityFilter } from "../components/facilities-filter";
import { PriceFilter } from "../components/price-filter";

const Search = () => {
  const search = useSearchContext();
  const [page, setPage] = useState<number>(1);
  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
  const [sortOption, setSortOption] = useState<string>("");

  const searchParams = {
    destination: search.destination,
    checkIn: search.checkIn.toISOString(),
    checkOut: search.checkOut.toISOString(),
    adultCount: search.adultCount.toString(),
    childCount: search.childCount.toString(),
    page: page.toString(),
    stars: selectedStars,
    types: selectedTypes,
    facilities: selectedFacilities,
    maxPrice: selectedPrice?.toString(),
    sortOption,
  };

  const { data: hotelData } = useQuery(["searchHotels", searchParams], () =>
    apiClient.searchHotels(searchParams)
  );

  const onPageChange = (page: number) => {
    setPage(page);
  };

  const handleStarsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const starRating = event.target.value;

    setSelectedStars((prevStars) =>
      event.target.checked
        ? [...prevStars, starRating]
        : prevStars.filter((star) => star !== starRating)
    );
  };

  const handleTypesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const type = event.target.value;

    setSelectedTypes((prevTypes) =>
      event.target.checked
        ? [...prevTypes, type]
        : prevTypes.filter((item) => item !== type)
    );
  };

  const handleFacilitiesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const facility = event.target.value;

    setSelectedFacilities((prevFacility) =>
      event.target.checked
        ? [...prevFacility, facility]
        : prevFacility.filter((item) => item !== facility)
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-5">
      <div className="rounded-lg border border-slate-300 p-5 h-fit lg:sticky top-10">
        <div className="space-y-5">
          <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
            Filter by:
          </h3>
          <StarRatingFilter
            selectedStars={selectedStars}
            onChange={handleStarsChange}
          />
          <TypesFilter
            selectedTypes={selectedTypes}
            onChange={handleTypesChange}
          />
          <FacilityFilter
            selectedFacilities={selectedFacilities}
            onChange={handleFacilitiesChange}
          />
          <PriceFilter
            selectedPrice={selectedPrice}
            onChange={(value?: number) => setSelectedPrice(value)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">
            {hotelData?.pagination.total} Hotel(s) found
            {search.destination ? ` in ${search.destination}` : ""}
          </span>
          <select
            value={sortOption}
            onChange={(event) => setSortOption(event.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">Sort By</option>
            <option value="starRating">Star Rating</option>
            <option value="pricePerNightAsc">
              Price Per Night (low to high)
            </option>
            <option value="pricePerNightDesc">
              Price Per Night (high to low)
            </option>
          </select>
        </div>
        {hotelData?.data.map((hotel) => (
          <SearchResultCard key={hotel._id} hotel={hotel} />
        ))}
        {hotelData?.pagination.pages && hotelData?.pagination.pages > 0 ? (
          <div>
            <Pagination
              page={hotelData?.pagination.page || 1}
              pages={hotelData?.pagination.pages || 1}
              onPageChange={onPageChange}
            />
          </div>
        ) : (
          <p className="text-center text-xl font-semibold pt-20">
            No hotels found! Try to clear out some filters.
          </p>
        )}
      </div>
    </div>
  );
};

export default Search;
