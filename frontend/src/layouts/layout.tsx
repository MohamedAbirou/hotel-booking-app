import { useLocation, useParams } from "react-router-dom";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { Hero } from "../components/hero";
import { SearchBar } from "../components/search-bar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { hotelId } = useParams();
  const location = useLocation();

  const pathname = location.pathname;

  const paths =
    pathname === "/" ||
    pathname === "/search" ||
    pathname === `/detail/${hotelId}`;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Hero />
      {paths && (
        <div className="container mx-auto px-4">
          <SearchBar />
        </div>
      )}
      <div className="container mx-auto px-4 py-10 flex-1 mt-5 mb-10">
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
