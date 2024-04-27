import { Link } from "react-router-dom";

export const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="p-6 bg-white rounded shadow-xl">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-700">
          You are not authenticated. Please log in to access this page, or go
          back to the home page.
        </p>
        <div className="flex items-center justify-between">
          <Link to="/sign-in" className="text-blue-500 hover:underline">
            Go to Login Page
          </Link>
          <Link to="/" className="text-blue-500 hover:underline">
            Go back to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
};
