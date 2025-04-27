import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

function Layout() {
  return (
    <div className="min-h-screen flex bg-gray-700 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <main className="flex-grow p-8">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
