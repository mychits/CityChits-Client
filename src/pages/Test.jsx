import React, { useEffect, useState } from "react";
import Datatable from "../components/layouts/Datatable";
import api from "../instance/TokenInstance";
import Sidebar from "../components/layouts/Sidebar";
import Navbar from "../components/layouts/Navbar";
import CustomCard from "../components/cards/CustomCard";

const Test = () => {
  return (
    <div className="flex">
      {/* <Sidebar navSearchBarVisibility={true}
       
      /> */}
      <CustomCard/>
    </div>
  );
};

export default Test;
