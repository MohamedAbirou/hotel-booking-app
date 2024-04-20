import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/app-context";
import { Link, useNavigate } from "react-router-dom";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const mutation = useMutation(apiClient.register, {
    onSuccess: async () => {
      showToast({ type: "SUCCESS", message: "Registration successful!" });
      await queryClient.invalidateQueries("checkSession");
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ type: "ERROR", message: error.message });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col gap-5 px-4" onSubmit={onSubmit}>
      <h2 className="text-2xl md:text-3xl font-bold">Create an Account</h2>
      <div className="flex flex-col md:flex-row gap-5">
        <label
          htmlFor="firstName"
          className="text-gray-700 text-sm font-bold flex-1"
        >
          First Name
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            type="text"
            id="firstName"
            {...register("firstName", { required: "This field is required" })}
          />
          {errors.firstName && (
            <span className="text-red-500">{errors.firstName.message}</span>
          )}
        </label>
        <label
          htmlFor="lastName"
          className="text-gray-700 text-sm font-bold flex-1"
        >
          Last Name
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            type="text"
            id="lastName"
            {...register("lastName", { required: "This field is required" })}
          />
          {errors.lastName && (
            <span className="text-red-500">{errors.lastName.message}</span>
          )}
        </label>
      </div>
      <label htmlFor="email" className="text-gray-700 text-sm font-bold flex-1">
        Email
        <input
          className="border rounded w-full py-1 px-2 font-normal"
          type="email"
          id="email"
          {...register("email", { required: "This field is required" })}
        />
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </label>
      <label
        htmlFor="password"
        className="text-gray-700 text-sm font-bold flex-1"
      >
        Password
        <input
          className="border rounded w-full py-1 px-2 font-normal"
          type="password"
          id="password"
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
        />
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>
      <label
        htmlFor="confirmPassword"
        className="text-gray-700 text-sm font-bold flex-1"
      >
        Confirm Password
        <input
          className="border rounded w-full py-1 px-2 font-normal"
          type="password"
          id="confirmPassword"
          {...register("confirmPassword", {
            validate: (value: string) => {
              if (!value) {
                return "This field is required";
              } else if (watch("password") !== value) {
                return "Your passwords don't match";
              }
            },
          })}
        />
        {errors.confirmPassword && (
          <span className="text-red-500">{errors.confirmPassword.message}</span>
        )}
      </label>
      <span className="flex items-center justify-between">
        <span className="text-sm">
          Already have an account?{" "}
          <Link to="/sign-in" className="hover:underline">
            sign in here.
          </Link>
        </span>
        <button className="bg-blue-600 text-white px-3 py-1.5 font-semibold hover:bg-blue-500 rounded">
          Create Account
        </button>
      </span>
    </form>
  );
};

export default Register;
