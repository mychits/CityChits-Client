import Navbar from "../components/layouts/Navbar";
import SettingSidebar from "../components/layouts/SettingSidebar";
import { Outlet } from "react-router-dom";

const LeadSetting = () => {
    const GlobalSearchChangeHandler = (e) => {
    const { value } = e.target;
    setSearchText(value);
  };
  return (
    <>
      <div>
        <div className="flex mt-20">
          <SettingSidebar />
         <Navbar
            onGlobalSearchChangeHandler={GlobalSearchChangeHandler}
            visibility={true}
          />
          
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default LeadSetting;
