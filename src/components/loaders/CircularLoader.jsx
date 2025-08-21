
import noDataFoundImage from "../../assets/images/noDataFound.svg";
const CircularLoader = ({
  color = "text-blue-600",
  isLoading =true,
  failure = false,
  data="data"
}) => {
  if (isLoading ) {
    // && !failure
    return (
      <div className="flex justify-center items-center ">
        <div
          className={`animate-spin inline-block w-12 h-12 border-4 border-current border-t-transparent ${color} rounded-full`}
        ></div>
      </div>
    );
  }
  if (failure  ) {
   
    return (
      <div className="flex justify-center items-center ">
        <div className="w-full h-screen flex justify-center ">
          <div>
            <img
              src={noDataFoundImage}
              alt="No Data Found image"
              className="w-3/4 h-1/2"
            />
            <div className="text-center text-2xl font-bold text-blue-700">
              No <span className="text-blue-800">
              {data}
                </span> Found
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default CircularLoader;
