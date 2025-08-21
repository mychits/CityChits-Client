import Navbar from "../components/layouts/Navbar";
import SettingSidebar from "../components/layouts/SettingSidebar";
import { Outlet } from "react-router-dom";

const LeadSetting = () => {
  return (
    <>
      <div>
        <div className="flex mt-20">
          <Navbar/>
          <SettingSidebar />
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default LeadSetting;
