export const Footer = () => {
  return (
    <div className="bg-blue-800 px-4 py-10">
      <div className="container mx-auto flex justify-between items-center">
        <span className="text-2xl md:text-3xl text-white font-bold tracking-tight">
          MyHolidays.com
        </span>
        <span className="text-white text-sm md:text-lg font-bold tracking-tight flex flex-row gap-4">
          <p className="cursor-pointer">Privacy Policy</p>
          <p className="cursor-pointer">Terms of Service</p>
        </span>
      </div>
    </div>
  );
};
