/* eslint-disable react/prop-types */
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
const Modal = ({ isVisible, onClose, children ,borderColor="primary"}) => {
  if (!isVisible) return null;


  const handleClose = (e) => {
    if (e.target.id === "wrapper") onClose();
  };
  return (
    <>
 <div 
  className={`fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex justify-center items-center z-50 `}
  onClick={handleClose}
>
  <div className="w-1/2 max-h-[calc(100vh-5rem)] flex flex-col relative overflow-hidden">
    <button
      className="text-gray-700 text-2xl absolute top-2 right-2 hover:bg-primary-variant  z-20 "
      onClick={() =>{ onClose()}}
    >
      <IoMdClose />
    </button>
    <div className={`bg-primary-variant  border-4 border-${borderColor} p-2 rounded-xl overflow-y-auto 
      [&::-webkit-scrollbar]:hidden [scrollbar-width:none]`}>
      {children}
    </div>
  </div>
</div>
    </>
  );  
};

export default Modal;
