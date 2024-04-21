import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./layouts/layout";
import Register from "./pages/register";
import Login from "./pages/login";
import AddHotel from "./pages/add-hotel";
import { useAppContext } from "./contexts/app-context";
import MyHotels from "./pages/my-hotels";

function App() {
  const { isLoggedIn } = useAppContext();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <p>Home Page</p>
            </Layout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout>
              <p>Search Page</p>
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />
        <Route
          path="/sign-in"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />
        {isLoggedIn && (
          <>
            <Route
              path="/add-hotel"
              element={
                <Layout>
                  <AddHotel />
                </Layout>
              }
            />
            <Route
              path="/my-hotels"
              element={
                <Layout>
                  <MyHotels />
                </Layout>
              }
            />
          </>
        )}
        <Route path="*" element={<>Navigate to</>} />
      </Routes>
    </Router>
  );
}

export default App;
