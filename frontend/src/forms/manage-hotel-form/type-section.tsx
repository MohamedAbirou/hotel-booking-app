import { useFormContext } from "react-hook-form";
import { hotelTypes } from "../../config/hotel-options-config";
import { HotelFormData } from "./manage-hotel-form";

export const TypeSection = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  const typeWatch = watch("type");

  return (
    <div>
      <h2 className="text-lg font-bold mb-3">Type</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {hotelTypes.map((type) => (
          <label
            key={type}
            className={`cursor-pointer text-center text-sm rounded-full px-4 py-2 font-semibold
              ${typeWatch === type ? "bg-blue-300" : "bg-gray-300"}
            `}
          >
            <input
              type="radio"
              value={type}
              className="hidden"
              {...register("type", {
                required: "This field is required",
              })}
            />
            <span>{type}</span>
          </label>
        ))}
      </div>
      {errors.type && (
        <span className="text-red-500 text-sm font-bold">
          {errors.type.message}
        </span>
      )}
    </div>
  );
};
