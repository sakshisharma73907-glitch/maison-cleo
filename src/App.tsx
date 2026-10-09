import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import NewArrivals from "./components/NewArrivals";
import Categories from "./components/Categories";
import Brands from "./components/Brands";
import Lookbook from "./components/Lookbook";
import Bestsellers from "./components/Bestsellers";
import About from "./components/About";
import Reviews from "./components/Reviews";
import Newsletter from "./components/Newsletter";
import InstagramRow from "./components/InstagramRow";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import StorefrontLayout from "./pages/StorefrontLayout";
import ProductPage from "./pages/ProductPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccountPage from "./pages/AccountPage";
import CheckoutPage from "./pages/CheckoutPage";
import CheckoutSuccessPage from "./pages/CheckoutSuccessPage";
import CheckoutCancelPage from "./pages/CheckoutCancelPage";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import ProductsAdmin from "./pages/admin/ProductsAdmin";
import OrdersAdmin from "./pages/admin/OrdersAdmin";

function Home() {
  return (
    <>
      <Hero />
      <NewArrivals />
      <Categories />
      <Brands />
      <Lookbook />
      <Bestsellers />
      <About />
      <Reviews />
      <Newsletter />
      <InstagramRow />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<StorefrontLayout />}>
        <Route index element={<Home />} />
        <Route path="product/:id" element={<ProductPage />} />
      </Route>

      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="account" element={<AccountPage />} />
      <Route path="checkout" element={<CheckoutPage />} />
      <Route path="checkout/success" element={<CheckoutSuccessPage />} />
      <Route path="checkout/cancel" element={<CheckoutCancelPage />} />

      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductsAdmin />} />
        <Route path="orders" element={<OrdersAdmin />} />
      </Route>

      <Route
        path="*"
        element={
          <div className="min-h-[100svh] bg-cream">
            <Navbar />
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
              <p className="font-display font-condensed text-5xl font-black uppercase tracking-tight text-terra">
                Lost?
              </p>
              <p className="text-sm text-ink/50">
                That page has wandered off the rack.
              </p>
              <a
                href="/"
                className="mt-2 bg-ink px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-cream transition-colors hover:bg-terra"
              >
                Back Home
              </a>
            </div>
            <Footer />
            <CartDrawer />
          </div>
        }
      />
    </Routes>
  );
}