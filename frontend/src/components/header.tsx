import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/app-context";
import { SignOutButton } from "./sign-out-btn";

export const Header = () => {
  const { isLoggedIn } = useAppContext();

  return (
    <div className="bg-blue-800 px-4 py-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between">
        <span className="text-2xl text-white font-bold tracking-tight">
          <Link to="/">MyHolidays.com</Link>
        </span>
        <span className="flex space-x-2 pt-5 pb-8 md:pt-0">
          {isLoggedIn ? (
            <>
              <Link
                to="/my-bookings"
                className="flex items-center text-white px-3 py-1 font-semibold rounded hover:bg-blue-600"
              >
                My Bookings
              </Link>
              <Link
                to="/my-hotels"
                className="flex items-center text-white px-3 py-1 font-semibold rounded hover:bg-blue-600"
              >
                My Hotels
              </Link>
              <SignOutButton />
            </>
          ) : (
            <Link
              to="/sign-in"
              className="flex items-center bg-white text-blue-600 px-3 py-1 font-semibold rounded hover:bg-gray-100 hover:text-blue-500"
            >
              Sign In
            </Link>
          )}
        </span>
      </div>
    </div>
  );
};
