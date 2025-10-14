import Sidebar from "../components/layouts/Sidebar";
import { useEffect, useState } from "react";
import api from "../instance/TokenInstance";
import CircularLoader from "../components/loaders/CircularLoader";
//import Password from "antd/es/input/Password";

const Profile = () => {
    useEffect(() => {
        function getAdminUser() {
            const user = localStorage.getItem("user");
            const userObj = JSON.parse(user);

            if (
                userObj &&
                userObj._id
            ) {

                setId(userObj._id);
            }
        }

        getAdminUser()
    }, [])

    const [phoneNumber, setPhoneNumber] = useState('');
    const [id, setId] = useState('');
    const [error, setError] = useState(null);
    const [currentUpdateAdminUser, setCurrentUpdateAdminUser] = useState(null);
     const [screenLoading, setScreenLoading] = useState(true);
    const [upDateProfileData, setUpDateProfileData] = useState({
        name: "",
        password: "",
        admin_name: "",
    });

    // useEffect(() => {
    //     const fetchAdmin = async () => {
    //         try {
    //             const response = await api.get(`/admin/get-admin/${id}`);
    //             setPhoneNumber(response.data.phoneNumber);
    //         } catch (error) {
    //             console.error("Error fetching admin:", error);
    //             setError("Error fetching admin data");
    //         }
    //     };
    //     fetchAdmin();
    // }, [id]);



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpDateProfileData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    useEffect(() => {
        setScreenLoading(true);
        handleUpdateModalOpen(id);
    }, [id]);
   

    const handleUpdateModalOpen = async (adminId) => {
        try {
            const response = await api.get(`/admin/get-admin/${adminId}`);
            
            // console.info(response.data,"data admin")
            setPhoneNumber(response.data?.phoneNumber || "");
            setCurrentUpdateAdminUser(response.data);
            setUpDateProfileData({
                name: response.data?.name || "",
                password: response.data?.password || "",
                admin_name: response.data?.admin_name || "",
            });
            setScreenLoading(false);

        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };
     if (screenLoading)
    return (
      <div className="w-screen m-24">
        <CircularLoader color="text-green-600" />;
      </div>
    );

    // const handleUpdate = async () => {
    //     try {
    //         const response = await api.put(`/admin/update-admin/${id}`, {
    //             phoneNumber: phoneNumber,

    //         });
    //         alert("Profile Updated Successfully")
    //     } catch (error) {
    //         console.error("Error updating profile:", error);
    //         setError("Error updating profile");
    //     }
    // };
    const handleUpdate = async () => {
        console.log(upDateProfileData,"updtatebbhhgb")
        try {
            const response = await api.put(`/admin/update-admin/${id}`, {
                phoneNumber,
                name: upDateProfileData.name,
                password: upDateProfileData.password,
                admin_name: upDateProfileData.admin_name,
            });
            alert("Profile Updated Successfully");
        } catch (error) {
            console.error("Error updating profile:", error);
            setError("Error updating profile");
        }
    };

    return (
        <>
            <div>
                <div className="flex mt-20">
                    <Sidebar />
                    <div className="flex-grow p-7">
                        <h1 className="text-2xl font-semibold mb-4">Profile</h1>
                        <div className="max-w-md mx-auto p-5 rounded-lg">
                            <div className="mb-4">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Enter your phone number"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={upDateProfileData?.name}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Update name"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="pass" className="block text-sm font-medium text-gray-700">Password</label>
                                <input
                                    type="text"
                                    id="pass"
                                    name="password"
                                    value={upDateProfileData?.password}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Update Password"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="aname" className="block text-sm font-medium text-gray-700">Admin Name</label>
                                <input
                                    type="text"
                                    id="aname"
                                    name="admin_name"
                                    value={upDateProfileData?.admin_name}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Update Admin name"
                                />
                            </div>

                            <button
                                onClick={handleUpdate}
                                className="w-full bg-violet-500 text-white p-2 rounded-md hover:bg-violet-700"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;



// const Profile = () => {
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [id, setId] = useState("674a74dbb6da8b6e035e9653"); // Replace with actual ID logic
//   const [error, setError] = useState(null);
//   const [upDateProfileData, setUpDateProfileData] = useState({
//     name: "",
//     password: "",
//     admin_name: "",
//   });

//   // Fetch data on mount
//   useEffect(() => {
//     handleUpdateModalOpen(id);
//   }, [id]);

//   // Fetch admin profile details
//   const handleUpdateModalOpen = async (adminId) => {
//     try {
//       const response = await api.get(`/admin/get-admin/${adminId}`);
//       const data = response.data;
//       setPhoneNumber(data.phoneNumber || "");
//       setUpDateProfileData({
//         name: data.name || "",
//         password: data.password || "",
//         admin_name: data.admin_name || "",
//       });
//     } catch (error) {
//       console.error("Error fetching profile:", error);
//       setError("Error fetching profile data");
//     }
//   };

//   // Input field change handler
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setUpDateProfileData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   // Update profile
//   const handleUpdate = async () => {
//     try {
//       await api.put(`/admin/update-admin/${id}`, {
//         phoneNumber,
//         name: upDateProfileData.name,
//         password: upDateProfileData.password,
//         admin_name: upDateProfileData.admin_name,
//       });
//       alert("Profile Updated Successfully");
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       setError("Error updating profile");
//     }
//   };

//   return (
//     <div className="flex mt-20">
//       <Sidebar />
//       <div className="flex-grow p-7">
//         <h1 className="text-2xl font-semibold mb-4">Profile</h1>
//         <div className="max-w-md mx-auto p-5 rounded-lg">
//           <div className="mb-4">
//             <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
//               Phone Number
//             </label>
//             <input
//               type="tel"
//               id="phone"
//               value={phoneNumber}
//               onChange={(e) => setPhoneNumber(e.target.value)}
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//               placeholder="Enter your phone number"
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//               Name
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={upDateProfileData.name}
//               onChange={handleInputChange}
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//               placeholder="Update name"
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//               Password
//             </label>
//             <input
//               type="text"
//               id="password"
//               name="password"
//               value={upDateProfileData.password}
//               onChange={handleInputChange}
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//               placeholder="Update password"
//             />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="admin_name" className="block text-sm font-medium text-gray-700">
//               Admin Name
//             </label>
//             <input
//               type="text"
//               id="admin_name"
//               name="admin_name"
//               value={upDateProfileData.admin_name}
//               onChange={handleInputChange}
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//               placeholder="Update admin name"
//             />
//           </div>
//           <button
//             onClick={handleUpdate}
//             className="w-full bg-secondary text-white p-2 rounded-md hover:bg-secondary"
//           >
//             Update
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;

