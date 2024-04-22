import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./manage-hotel-form";
import { useLocation } from "react-router-dom";

export const DetailsSection = () => {
  const location = useLocation();

  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  const heading =
    location.pathname === "/add-hotel" ? "Add Hotel" : "Edit Hotel";

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold mb-3">{heading}</h1>
      <label htmlFor="name" className="text-gray-700 text-sm font-bold flex-1">
        Name
        <input
          className="border rounded w-full py-1 px-2 font-normal"
          type="text"
          id="name"
          {...register("name", { required: "This field is required" })}
        />
        {errors.name && (
          <span className="text-red-500">{errors.name.message}</span>
        )}
      </label>
      <div className="flex gap-4">
        <label
          htmlFor="city"
          className="text-gray-700 text-sm font-bold flex-1"
        >
          City
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            type="text"
            id="city"
            {...register("city", { required: "This field is required" })}
          />
          {errors.city && (
            <span className="text-red-500">{errors.city.message}</span>
          )}
        </label>
        <label
          htmlFor="country"
          className="text-gray-700 text-sm font-bold flex-1"
        >
          Country
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            type="text"
            id="country"
            {...register("country", { required: "This field is required" })}
          />
          {errors.country && (
            <span className="text-red-500">{errors.country.message}</span>
          )}
        </label>
      </div>
      <label
        htmlFor="description"
        className="text-gray-700 text-sm font-bold flex-1"
      >
        Description
        <textarea
          rows={10}
          className="border rounded w-full py-1 px-2 font-normal"
          id="description"
          {...register("description", { required: "This field is required" })}
        />
        {errors.description && (
          <span className="text-red-500">{errors.description.message}</span>
        )}
      </label>
      <label
        htmlFor="pricePerNight"
        className="text-gray-700 text-sm font-bold max-w-[50%]"
      >
        Price Per Night
        <input
          type="number"
          min={1}
          className="border rounded w-full py-1 px-2 font-normal"
          id="pricePerNight"
          {...register("pricePerNight", { required: "This field is required" })}
        />
        {errors.pricePerNight && (
          <span className="text-red-500">{errors.pricePerNight.message}</span>
        )}
      </label>
      <label
        htmlFor="starRating"
        className="text-gray-700 text-sm font-bold max-w-[50%]"
      >
        Star Rating
        <select
          {...register("starRating", {
            required: "This field is required",
          })}
          id="starRating"
          className="border rounded w-full p-2 text-gray-700 font-normal"
        >
          <option value="" className="text-sm font-bold">
            Select as Rating
          </option>
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
        {errors.starRating && (
          <span className="text-red-500">{errors.starRating.message}</span>
        )}
      </label>
    </div>
  );
};
