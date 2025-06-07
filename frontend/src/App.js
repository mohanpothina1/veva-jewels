import "./App.css";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import CategorySlider from "./components/CategorySlider";
import MarketingCard from "./components/MarketingCard";
import RecommendedForYou from "./components/RecommendedForYou";
import AnkletsToeringsBanner from "./components/AnkletsToeringsBanner";
import Banner from "./components/Banner";
import MostGifted from "./components/MostGifted";
import CustomerStories from "./components/CustomerStories";
import Footer from "./components/Footers";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import ShopByRecipient from "./components/ShopByRecipient";

// Login Flow
import Login from "./components/Login";

// Pages
import Earrings from "./pages/Earrings";
import Anklets from "./pages/Anklets"; 
import ToeRings from "./pages/ToeRings";
import Choker from "./pages/Choker";
import Mangalsutra from "./pages/Mangalsutra";
import MensPunjabiKada from "./pages/MensPunjabiKada";
import SilverChains from "./pages/SilverChains";
import KumkumBox from "./pages/KumkumBox";
import Coins from "./pages/Coins";
import SilverJewellery from "./pages/SilverJewellery";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import MenCollection from "./pages/MenCollection";
import WomenCollection from "./pages/WomenCollection";
import ProductDetail from "./pages/ProductDetail";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <ConditionalLayout />
        <Footer />
      </Router>
    </div>
  );
}

function ConditionalLayout() {
  const location = useLocation();

  const noExtraComponentsPaths = [
    "/womens/earrings",
    "/womens/anklets",
    "/womens/toerings",
    "/womens/choker",
    "/womens/mangalsutra",
    "/mens-punjabi-kada",
    "/silver-chains",
    "/kumkum-box",
    "/coins",
    "/silver-jewellery",
    "/cart",
    "/wishlist",
    "/about-us",
    "/contact-us",
    "/product/:id",
    "/men-collection",
    "/women-collection",
    "/login", // Include your login path
  ];

  const pathMatches = noExtraComponentsPaths.some((path) =>
    path.includes(":")
      ? new RegExp("^" + path.replace(/:\w+/g, "[^/]+") + "$").test(location.pathname)
      : path === location.pathname
  );

  if (pathMatches) {
    return (
      <Routes>
        <Route path="/womens/earrings" element={<Earrings />} />
        <Route path="/womens/anklets" element={<Anklets />} /> 
        <Route path="/womens/toerings" element={<ToeRings />} />
        <Route path="/womens/choker" element={<Choker />} />
        <Route path="/womens/mangalsutra" element={<Mangalsutra />} />
        <Route path="/mens-punjabi-kada" element={<MensPunjabiKada />} />
        <Route path="/silver-chains" element={<SilverChains />} />
        <Route path="/kumkum-box" element={<KumkumBox />} />
        <Route path="/coins" element={<Coins />} />
        <Route path="/silver-jewellery" element={<SilverJewellery />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/men-collection" element={<MenCollection />} />
        <Route path="/women-collection" element={<WomenCollection />} />
        <Route path="/login" element={<Login />} /> {/* Main login flow route */}
      </Routes>
    );
  }

  return (
    <>
      <HeroSection />
      <CategorySlider />
      <MarketingCard />
      <ShopByRecipient />
      <RecommendedForYou />
      <AnkletsToeringsBanner />
      <Banner />
      <MostGifted />
      <CustomerStories />
      <Routes>{/* Additional routes can be added here */}</Routes>
    </>
  );
}

export default App;
