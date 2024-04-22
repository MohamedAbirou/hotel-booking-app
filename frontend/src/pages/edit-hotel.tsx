import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../api-client";
import { ManageHotelForm } from "../forms/manage-hotel-form/manage-hotel-form";
import { useAppContext } from "../contexts/app-context";

const EditHotel = () => {
  const { hotelId } = useParams();
  const { showToast } = useAppContext();

  const { data: hotel } = useQuery(
    "fetchMyHotelById",
    () => apiClient.fetchMyHotelById(hotelId!),
    {
      enabled: !!hotelId,
    }
  );

  const { mutate, isLoading } = useMutation(apiClient.updateMyHotelById, {
    onSuccess: () => {
      showToast({ message: "Hotel Updated!", type: "SUCCESS" });
    },
    onError: () => {
      showToast({ message: "Failed to update hotel!", type: "ERROR" });
    },
  });

  const handleSave = (hotelFormData: FormData) => {
    mutate(hotelFormData);
  };

  return (
    <ManageHotelForm onSave={handleSave} hotel={hotel!} isLoading={isLoading} />
  );
};

export default EditHotel;
