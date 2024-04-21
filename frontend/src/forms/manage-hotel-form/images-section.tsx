import { useFormContext } from "react-hook-form";
import { HotelFormData } from "./manage-hotel-form";

export const ImagesSection = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<HotelFormData>();

  const imageFilesWatch = watch("imageFiles");

  return (
    <div>
      <h2 className="text-lg font-bold mb-3">Images</h2>

      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="imageFiles"
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer ${
            imageFilesWatch && imageFilesWatch.length === 0
              ? "bg-gray-300 hover:bg-gray-400/80"
              : "bg-blue-300 hover:bg-blue-400/80"
          } transition-colors duration-300`}
        >
          <div
            className={`flex flex-col items-center justify-center pt-5 pb-6`}
          >
            <svg
              className="w-8 h-8 text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            {imageFilesWatch && imageFilesWatch.length === 0 ? (
              <>
                <p className="mb-2 text-sm text-white">
                  <span className="font-semibold">Click to upload</span>
                </p>
                <p className="text-xs text-white">SVG, PNG, JPG or GIF</p>
              </>
            ) : imageFilesWatch ? (
              <p className="text-xl text-white pl-3 font-semibold">
                {imageFilesWatch.length}{" "}
                {imageFilesWatch.length === 1 ? "image" : "images"} selected.
              </p>
            ) : null}
          </div>
          <input
            id="imageFiles"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            {...register("imageFiles", {
              validate: (imageFiles) => {
                const totalLength = imageFiles.length;

                if (totalLength === 0) {
                  return "At least one image should be added";
                }

                if (totalLength > 6) {
                  return "Total number of images cannot be more than 6";
                }

                return true;
              },
            })}
          />
        </label>
      </div>
      {errors.imageFiles && (
        <span className="text-red-500 font-bold text-sm">
          {errors.imageFiles.message}
        </span>
      )}
    </div>
  );
};
