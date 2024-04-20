import { useEffect } from "react";

type ToastProps = {
  message: string;
  type: "SUCCESS" | "ERROR";
  onClose: () => void;
};

export const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const styles =
    type === "SUCCESS"
      ? "fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-2 py-1 rounded-md bg-white shadow-xl font-bold text-green-600 max-w-md"
      : "fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-2 py-1 rounded-md bg-white shadow-xl font-bold text-red-600 max-w-md";

  return (
    <div className={styles}>
      <div className="flex justify-center items-center">
        <span className="font-semibold">{message}</span>
      </div>
    </div>
  );
};
