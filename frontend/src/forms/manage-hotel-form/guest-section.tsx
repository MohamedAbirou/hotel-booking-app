import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./manage-hotel-form";

export const GuestSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  return (
    <div>
      <h2 className="text-lg font-bold mb-3">Guests</h2>
      <div className="bg-gray-300 flex justify-between gap-4 p-4">
        <label
          htmlFor="adultCount"
          className="text-gray-700 text-sm font-bold flex-1"
        >
          Adults
          <input
            type="number"
            min={1}
            defaultValue={1}
            className="border rounded w-full py-1 px-2 font-normal"
            id="adultCount"
            {...register("adultCount", { required: "This field is required" })}
          />
          {errors.adultCount && (
            <span className="text-red-500">{errors.adultCount.message}</span>
          )}
        </label>
        <label
          htmlFor="childCount"
          className="text-gray-700 text-sm font-bold flex-1"
        >
          Children
          <input
            type="number"
            min={0}
            defaultValue={0}
            className="border rounded w-full py-1 px-2 font-normal"
            id="childCount"
            {...register("childCount", { required: "This field is required" })}
          />
          {errors.childCount && (
            <span className="text-red-500">{errors.childCount.message}</span>
          )}
        </label>
      </div>
    </div>
  );
};
