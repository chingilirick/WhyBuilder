import { Outlet } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { CurrencyProvider } from "../context/CurrencyContext";

export default function Root() {
  return (
    <CurrencyProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </CurrencyProvider>
  );
}