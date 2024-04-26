import { FormProvider, useForm } from "react-hook-form";
import { DetailsSection } from "./details-section";
import { TypeSection } from "./type-section";
import { FacilitySection } from "./facility-section";
import { GuestSection } from "./guest-section";
import { BookingType, HotelType } from "../../../../backend/src/shared/types";
import { useEffect } from "react";
import { ImagesSection } from "./images-section";

export type HotelFormData = {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  pricePerNight: number;
  starRating: number;
  facilities: string[];
  imageFiles: FileList;
  imageUrls: string[];
  adultCount: number;
  childCount: number;
  bookings: BookingType[];
};

type Props = {
  onSave: (hotelFormData: FormData) => void;
  isLoading: boolean;
  hotel?: HotelType;
};

export const ManageHotelForm = ({ onSave, isLoading, hotel }: Props) => {
  const formMethods = useForm<HotelFormData>();

  const { handleSubmit, reset } = formMethods;

  useEffect(() => {
    reset(hotel);
  }, [hotel, reset]);

  const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
    const formData = new FormData();

    if (hotel) {
      formData.append("hotelId", hotel._id);
    }

    formData.append("name", formDataJson.name);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);
    formData.append("description", formDataJson.description);
    formData.append("type", formDataJson.type);
    formData.append("pricePerNight", String(formDataJson.pricePerNight));
    formData.append("starRating", String(formDataJson.starRating));
    formData.append("adultCount", String(formDataJson.adultCount));
    formData.append("childCount", String(formDataJson.childCount));

    formDataJson.facilities.forEach((facility, index) => {
      formData.append(`facilities[${index}]`, facility);
    });

    // [image1.jpg, image2.jpg, image3.jpg]
    // imageUrls = [image1.jpg]
    if (formDataJson.imageUrls) {
      formDataJson.imageUrls.forEach((url, index) => {
        formData.append(`imageUrls[${index}]`, url);
      });
    }

    Array.from(formDataJson.imageFiles).forEach((imageFile) => {
      formData.append(`imageFiles`, imageFile);
    });

    onSave(formData);
    reset();
  });

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={onSubmit} className="flex flex-col gap-10">
        <DetailsSection />
        <TypeSection />
        <FacilitySection />
        <GuestSection />
        <ImagesSection />
        <span className="flex justify-end">
          <button
            disabled={isLoading}
            type="submit"
            className="bg-blue-600 text-white px-4 py-1 font-semibold hover:bg-blue-500 rounded disabled:bg-gray-500"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </span>
      </form>
    </FormProvider>
  );
};
