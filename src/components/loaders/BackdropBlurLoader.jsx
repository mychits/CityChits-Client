import {Spin } from "antd"
const BackdropBlurLoader = ({title}) => {
  

  return (
    <div
      
      className="fixed  w-screen h-screen  z-50 flex items-center justify-center
                 bg-black bg-opacity-25 backdrop-blur-sm"
    >
     
       <Spin tip={`Please wait...`}>{title}</Spin>
    </div>
  );
};

export default BackdropBlurLoader;