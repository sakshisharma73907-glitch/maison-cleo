import { Outlet } from "react-router-dom";
import CartDrawer from "../components/CartDrawer";
import Footer from "../components/Footer";
import MobileCartFab from "../components/MobileCartFab";
import Navbar from "../components/Navbar";

export default function StorefrontLayout() {
  return (
    <div id="top">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <MobileCartFab />
      <CartDrawer />
    </div>
  );
}