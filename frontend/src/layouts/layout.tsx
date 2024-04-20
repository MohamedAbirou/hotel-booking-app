import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { Hero } from "../components/hero";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Hero />
      <div className="container mx-auto px-4 py-10 flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
