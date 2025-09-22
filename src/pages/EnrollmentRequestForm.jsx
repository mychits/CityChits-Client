import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../instance/TokenInstance";

const EnrollmentRequestForm = () => {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [searchParams] = useSearchParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  const [districts, setDistricts] = useState([]);

  const [errors, setErrors] = useState({});

  const [enrollData, setEnrollData] = useState({
    selected_plan: "",
    title: "",
    full_name: "",
    password: "",
    gender: "",
    marital_status: "",
    dateofbirth: null,
    nationality: "",
    village: "",
    taluk: "",
    father_name: "",
    district: "",
    state: "",
    phone_number: "",
    alternate_number: "",
    referral_name: "",
    address: "",
    area: "",
    email: "",
    pincode: "",
    nominee_name: "",
    nominee_dateofbirth: null,
    nominee_phone_number: "",
    nominee_relationship: "",
    adhaar_no: "",
    pan_no: "",
    aadhar_frontphoto: "null",
    aadhar_backphoto: "null",
    pan_frontphoto: "null",
    pan_backphoto: "null",
    profilephoto: "null",
    bank_name: "",
    bank_branch_name: "",
    bank_account_number: "",
    bank_IFSC_code: "",
    customer_status: "inactive",
    track_source: "enrollment_form",
  });

  useEffect(() => {
    const fetchSelectedGroup = async () => {
      try {
        const group_id = searchParams.get("group_id");
        const res = await api.get(`group/get-by-id-group/${group_id}`);
        const data = res.data;
        setSelectedGroup(data);
      } catch (err) {
        console.error("failed to fetch group", err);
      }
    };
    fetchSelectedGroup();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await api.get("/user/district");
        setDistricts(response.data?.data?.districts);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };

    fetchDistricts();
  }, []);
  const validateForm = (type) => {
    const newErrors = {};
    const data = type === "addEnrollCustomer" ? enrollData : null;
    const regex = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phone: /^[6-9]\d{9}$/,
      pincode: /^\d{6}$/,
      adhaar: /^\d{12}$/,
      pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    };

    if (!data.first_name.trim()) {
      newErrors.full_name = "Full Name is required";
    }

    // if (!data.email) {
    //   newErrors.email = "Email is required";
    // } else
    if (data.email && !regex.email.test(data.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!data.phone_number) {
      newErrors.phone_number = "Phone number is required";
    } else if (!regex.phone.test(data.phone_number)) {
      newErrors.phone_number = "Invalid  phone number";
    }

    if (!data.password) {
      newErrors.password = "Password is required";
    }
    // else if (!regex.password.test(data.password)) {
    //   newErrors.password =
    //     "Password must contain at least 5 characters, one uppercase, one lowercase, one number, and one special character";
    // }

    if (!data.pincode) {
      newErrors.pincode = "Pincode is required";
    } else if (!regex.pincode.test(data.pincode)) {
      newErrors.pincode = "Invalid pincode (6 digits required)";
    }

    if (!data.adhaar_no) {
      newErrors.adhaar_no = "Aadhar number is required";
    } else if (!regex.adhaar.test(data.adhaar_no)) {
      newErrors.adhaar_no = "Invalid Aadhar number (12 digits required)";
    }
    if (data.pan_no && !regex.pan.test(data.pan_no.toUpperCase())) {
      newErrors.pan_no = "Invalid PAN format (e.g., ABCDE1234F)";
    }

    if (!data.address.trim()) {
      newErrors.address = "Address is required";
    } else if (data.address.trim().length < 3) {
      newErrors.address = "Address should be at least 3 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setEnrollData({ ...enrollData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setEnrollData({ ...enrollData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullName = `${enrollData.first_name || ""} ${
      enrollData.last_name || ""
    }`.trim();
    const fullNameEnrollData = { ...enrollData, full_name: fullName };
    const isValid = validateForm("addEnrollCustomer");

    if (isValid) {
      try {
        const url = `user/add-enrollment-request-data`;

        const enrollDataObj = new FormData();

        const { selected_plan, ...restEnrollData } = fullNameEnrollData;

        Object.entries(restEnrollData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            enrollDataObj.append(key, value);
          }
        });

        if (
          selectedGroup &&
          selectedGroup._id &&
          selectedGroup.group_name &&
          selectedGroup.group_value &&
          selectedGroup.group_install &&
          selectedGroup.group_duration
        )
          enrollDataObj.append("selected_plan", selectedGroup._id);

        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };

        const response = await api.post(url, enrollDataObj, config);

        setIsSubmitted(true);

        alert("Enrollment successful!");
      } catch (error) {
        console.error("Error submitting enrollment:", error);
        alert("Failed to submit enrollment. Please try again.");
      }
    }
  };
  if (isSubmitted) {
    return (
      <div className="border-2  mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 flex flex-col items-center space-y-4">
          <h2 className="text-2xl font-medium text-gray-900">Thank You!</h2>

          <p className="text-gray-600 text-center">
            Your enrollment was successful. We're excited to have you on board!
          </p>

          <Link to={"https://maps.app.goo.gl/X7FezFRPiTjuYoVt5"}>
            <button className="mt-4 px-6 py-2 bg-violet-600 text-white font-semibold rounded hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-300 transition">
              Our Location
            </button>
          </Link>
        </div>
      </div>
    );
  } else {
    return (
      <div className="bg-white p-4 rounded-md shadow-2xl sm:my-10 sm:mx-64">
        <form onSubmit={handleSubmit}>
          <div className="m-3 mt-3 p-4 text-xl sm:text-4xl font-bold rounded-md text-amber-50 bg-custom-violet">
            <h2> Chit Enrollment Form </h2>
          </div>

          <div className="m-4">
            <>
              <h1 className="text-left text-white sm:text-lg text-sm font-semibold mt-6">
                Change Chit Plan
              </h1>
              <h2 className="text-left  sm:text-lg text-sm font-semibold ">
                Group Name
              </h2>
              <select
                disabled
                className="w-full p-2 border border-gray-300 rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50  focus:ring-violet-500  focus:border-violet-500 cursor-not-allowed"
              >
                <option value={selectedGroup?._id} className="text-gray-600">
                  {selectedGroup?.group_name}
                </option>
              </select>

              <div className="sm:flex gap-4">
                <div className="sm:w-1/2 w-full">
                  <h2 className="text-left  sm:text-lg text-sm font-semibold ">
                    Group Type
                  </h2>
                  <input
                    className="w-full p-2 border border-gray-300 bg-gray-50 rounded-md mb-4 mt-1 sm:text-lg text-sm  text-gray-600 focus:ring-violet-500  focus:border-violet-500 cursor-not-allowed"
                    name=""
                    type="text"
                    placeholder=""
                    value={
                      `${
                        selectedGroup?.group_type?.charAt(0)?.toUpperCase() +
                        selectedGroup?.group_type?.slice(1)
                      } Group` || ""
                    }
                    disabled
                  />
                </div>
                <div className="sm:w-1/2 w-full">
                  <h2 className="text-left sm:text-lg text-sm font-semibold">
                    Group Value
                  </h2>
                  <input
                    className="w-full p-2 border  border-gray-300 rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 text-gray-600 focus:ring-violet-500  focus:border-violet-500 hover:cursor-not-allowed"
                    name=""
                    type="text"
                    placeholder="50000 "
                    value={selectedGroup?.group_value || ""}
                    disabled
                  />
                </div>
              </div>

              <div className="sm:flex gap-4">
                <div className="sm:w-1/2 w-full">
                  <h2 className="text-left sm:text-lg text-sm font-semibold ">
                    Group Installment
                  </h2>
                  <input
                    className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-600 focus:ring-violet-500  focus:border-violet-500 hover:cursor-not-allowed"
                    name=""
                    type="text"
                    placeholder="400 "
                    value={selectedGroup?.group_install || ""}
                    disabled
                  />
                </div>
                <div className="sm:w-1/2 w-full">
                  <h2 className="text-left sm:text-lg text-sm font-semibold">
                    Group Duration
                  </h2>
                  <input
                    className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-600 focus:ring-violet-500  focus:border-violet-500 hover:cursor-not-allowed"
                    name=""
                    type="text"
                    placeholder="13.2 "
                    value={selectedGroup?.group_duration || ""}
                    disabled
                  />
                </div>
              </div>
            </>
          </div>

          <div>
            <div className="bg-[#4c107e] rounded-md m-3 ">
              <h2 className="p-4 text-left text-white rounded-md font-bold text-xl bg-custom-violet ">
                {" "}
                Customer Details
              </h2>
            </div>

            <div className="m-4">
              <>
                {step === 1 && (
                  <div>
                    <div className="sm:flex  gap-4">
                      <div className="sm:w-1/6 w-full">
                        <h1 className="text-left sm:text-lg text-sm font-semibold ">
                          Title
                        </h1>
                        <select
                          name="title"
                          value={enrollData?.title}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500  focus:border-violet-500"
                        >
                          <option value="">Select </option>
                          <option value="Mr">Mr</option>
                          <option value="Ms">Ms</option>
                          <option value="Mrs">Mrs</option>
                          <option value="M/S">Mrs</option>
                          <option value="Dr">Dr</option>
                        </select>
                      </div>
                      <div className="sm:w-1/2 w-full">
                        <h1 className="text-left sm:text-lg text-sm font-semibold ">
                          First Name
                        </h1>
                        <input
                          className="bg-gray-50 w-full p-2 rounded-lg mb-4 mt-1 sm:text-lg text-sm  border border-gray-300 text-gray-900 focus:ring-violet-500  focus:border-violet-500"
                          name="first_name"
                          type="text"
                          required
                          placeholder="Enter First Name"
                          value={enrollData?.first_name || ""}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="sm:w-1/2 w-full">
                        <h1 className="text-left sm:text-lg text-sm font-semibold ">
                          Last Name
                        </h1>
                        <input
                          className="bg-gray-50 w-full p-2 rounded-lg mb-4 mt-1 sm:text-lg text-sm  border border-gray-300 text-gray-900 focus:ring-violet-500  focus:border-violet-500"
                          name="last_name"
                          type="text"
                          placeholder="Enter Last Name"
                          value={enrollData?.last_name || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    {errors.full_name && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.full_name}
                      </p>
                    )}

                    <div className="sm:flex  gap-4">
                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold ">
                          Password
                        </h2>
                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 placeholder:text-black bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500  focus:border-violet-500"
                          name="password"
                          type="password"
                          placeholder="Enter Password"
                          value={enrollData?.password || ""}
                          onChange={handleChange}
                          required
                        />
                        {errors.password && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.password}
                          </p>
                        )}
                      </div>

                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold ">
                          Date of Birth
                        </h2>
                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 placeholder:text-black bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500  focus:border-violet-500"
                          name="dateofbirth"
                          type="date"
                          placeholder="dd-mm-yyyy"
                          value={enrollData?.dateofbirth || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="sm:w-1/2 w-full">
                        <h1 className="text-left sm:text-lg text-sm font-semibold  ">
                          Gender
                        </h1>
                        <select
                          name="gender"
                          value={enrollData?.gender}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md mb-4 sm:text-lg text-sm  mt-1 bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500  focus:border-violet-500"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                    </div>

                    <div className="sm:flex gap-4">
                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold ">
                          Phone Number
                        </h2>

                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500  focus:border-violet-500"
                          name="phone_number"
                          type="tel"
                          inputMode="numeric"
                          placeholder="Enter Phone Number"
                          value={enrollData?.phone_number}
                          onChange={handleChange}
                          required
                        />
                        {errors.phone_number && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.phone_number}
                          </p>
                        )}
                      </div>

                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold  ">
                          Email ID
                        </h2>

                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500  focus:border-violet-500"
                          name="email"
                          type="email"
                          placeholder="Enter Email ID"
                          value={enrollData?.email}
                          onChange={handleChange}
                          required
                        />
                        {errors.email && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="sm:flex gap-4">
                      <div className="sm:w-1/2 w-full">
                        <h1 className="text-left sm:text-lg text-sm font-semibold  ">
                          Marital Status
                        </h1>
                        <select
                          name="marital_status"
                          value={enrollData?.marital_status}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md mb-4 sm:text-lg text-sm mt-1 bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500  focus:border-violet-500"
                        >
                          <option value="">Select Marital Status</option>
                          <option value="Married">Married</option>
                          <option value="Unmarried">Unmarried</option>
                        </select>
                      </div>

                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold  ">
                          Referral Name
                        </h2>
                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500  focus:border-violet-500"
                          name="referral_name"
                          type="text"
                          placeholder="Enter Referral Name"
                          value={enrollData?.referral_name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="sm:flex gap-4">
                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold ">
                          Nationality
                        </h2>
                        <select
                          name="nationality"
                          value={enrollData?.nationality}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md mb-4 sm:text-lg text-sm mt-1 bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500  focus:border-violet-500"
                        >
                          <option value="">Select Nationality</option>
                          <option value="Indian">Indian</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="w-full sm:w-1/2">
                        <h2 className="text-left sm:text-lg text-sm font-semibold ">
                          Alternate Number
                        </h2>
                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500  focus:border-violet-500"
                          name="alternate_number"
                          type="tel"
                          inputMode="numeric"
                          placeholder="Enter Alternate Number"
                          value={enrollData?.alternate_number}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="sm:flex gap-4">
                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold ">
                          Village
                        </h2>
                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500  focus:border-violet-500"
                          name="village"
                          type="text"
                          placeholder="Enter Village "
                          value={enrollData?.village}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold">
                          Taluk
                        </h2>
                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500  focus:border-violet-500"
                          name="taluk"
                          type="text"
                          placeholder="Enter Taluk "
                          value={enrollData?.taluk}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="sm:flex gap-4">
                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold">
                          State
                        </h2>
                        <select
                          name="state"
                          value={enrollData?.state}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500 focus:border-violet-500"
                        >
                          <option value="">Select State</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                        </select>
                      </div>

                      {enrollData?.state === "Karnataka" ? (
                        <div className="sm:w-1/2 w-full">
                          <h2 className="text-left sm:text-lg text-sm font-semibold">
                            District
                          </h2>
                          <select
                            name="district"
                            value={enrollData?.district}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500 focus:border-violet-500"
                          >
                            <option value="">Select District</option>
                            {districts.map((district, index) => (
                              <option key={index} value={district}>
                                {district}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div className="sm:w-1/2 w-full">
                          <h2 className="text-left sm:text-lg text-sm font-semibold">
                            District
                          </h2>
                          <input
                            type="text"
                            name="district"
                            value={enrollData?.district}
                            onChange={handleChange}
                            placeholder="Enter District"
                            className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500 focus:border-violet-500"
                          />
                        </div>
                      )}
                    </div>

                    <h2 className="text-left sm:text-lg text-sm font-semibold  ">
                      Address
                    </h2>
                    <input
                      className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500  focus:border-violet-500"
                      name="address"
                      type="text"
                      placeholder="Address"
                      value={enrollData?.address}
                      onChange={handleChange}
                      required
                    />
                    {errors.address && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.address}
                      </p>
                    )}
                    <div className="sm:flex gap-4">
                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold  ">
                          Father Name
                        </h2>
                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500  focus:border-violet-500"
                          name="father_name"
                          type="text"
                          placeholder="Enter Customer Father Name"
                          value={enrollData?.father_name}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold  ">
                          Pincode
                        </h2>
                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500  focus:border-violet-500"
                          name="pincode"
                          type="number"
                          placeholder="Enter Pincode"
                          inputMode="numeric"
                          value={enrollData?.pincode}
                          onChange={handleChange}
                          required
                        />
                        {errors.pincode && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.pincode}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="sm:flex gap-3">
                      <button
                        type="button"
                        className="w-40 active:scale-95 font-semibold border-2 border-black shadow-md bg-custom-violet hover:bg-violet-600 text-white p-2 rounded-md"
                        onClick={() => setStep(2)}
                      >
                        Add Nominee
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <div className="bg-[#17216D] rounded-md mb-3">
                      <h2 className="p-4 text-left font-bold rounded-md bg-custom-violet text-xl text-white">
                        {" "}
                        Nominee Details
                      </h2>
                    </div>

                    <div className="sm:flex gap-4">
                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold  ">
                          Nominee Name
                        </h2>
                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500  focus:border-violet-500"
                          name="nominee_name"
                          type="text"
                          placeholder="Enter Nominee Name"
                          value={enrollData?.nominee_name}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold  ">
                          Nominee Date of Birth
                        </h2>
                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500  focus:border-violet-500"
                          name="nominee_dateofbirth"
                          type="date"
                          placeholder="dd-mm-yyyy"
                          value={enrollData?.nominee_dateofbirth || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="sm:flex gap-4">
                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold  ">
                          Nominee Relationship
                        </h2>
                        <select
                          name="nominee_relationship"
                          value={enrollData?.nominee_relationship}
                          onChange={handleChange}
                          className="w-full p-2 border rounded-md  sm:text-lg text-sm mb-4 mt-1 bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500  focus:border-violet-500"
                        >
                          <option value="">Select Relationship</option>
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Brother/Sister">Brother/Sister</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Son/Daughter">Son/Daughter</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold  ">
                          Nominee Phone Number
                        </h2>
                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500  focus:border-violet-500"
                          name="nominee_phone_number"
                          type="numeric"
                          placeholder="Enter Nominee Phone Number"
                          value={enrollData?.nominee_phone_number}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="sm:flex gap-3">
                      <button
                        type="button"
                        className="w-40 active:scale-95 font-semibold border-2 border-black shadow-md bg-custom-violet hover:bg-violet-600 text-white p-2 rounded-md"
                        onClick={() => setStep(1)}
                      >
                        Back
                      </button>

                      <button
                        type="button"
                        className="w-40 active:scale-95 font-semibold border-2 border-black shadow-md bg-custom-violet hover:bg-violet-600 text-white p-2 rounded-md"
                        onClick={() => setStep(3)}
                      >
                        Add Documents
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <div className="bg-[#17216D] rounded-md">
                      <h2 className="p-4 text-left font-bold rounded-md bg-custom-violet text-xl text-white mb-3">
                        {" "}
                        Document Details
                      </h2>
                    </div>

                    <div className="sm:flex gap-4">
                      <div className="sm:w-1/2 w-full">
                        <h1 className="text-left sm:text-lg text-sm font-semibold ">
                          Aadhar Number
                        </h1>
                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500  focus:border-violet-500"
                          name="adhaar_no"
                          type="numeric"
                          placeholder="Enter Adhaar Number"
                          value={enrollData?.adhaar_no}
                          onChange={handleChange}
                          required
                        />
                        {errors.adhaar_no && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.adhaar_no}
                          </p>
                        )}
                      </div>

                      <div className="sm:w-1/2 w-full">
                        <h1 className="text-left sm:text-lg text-sm font-semibold ">
                          Pan Number
                        </h1>

                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500  focus:border-violet-500"
                          name="pan_no"
                          type="text"
                          accept="image/*"
                          placeholder="Enter Pan Number"
                          value={enrollData?.pan_no}
                          onChange={handleChange}
                          required
                        />
                        {errors.pan_no && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.pan_no}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="sm:flex gap-4">
                      <div className="sm:w-1/2 w-full">
                        <h1 className="text-left sm:text-lg text-sm font-semibold ">
                          Aadhaar Front Photo
                        </h1>

                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500  focus:border-violet-500"
                          name="aadhar_frontphoto"
                          type="file"
                          accept="image/*"
                          placeholder="No file choosen"
                          onChange={handleFileChange}
                        />
                      </div>

                      <div className="sm:w-1/2 w-full">
                        <h1 className="text-left sm:text-lg text-sm font-semibold ">
                          Aadhaar Back photo
                        </h1>

                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500  focus:border-violet-500"
                          name="aadhar_backphoto"
                          type="file"
                          accept="image/*"
                          placeholder="No file choosen"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>

                    <div className="sm:flex gap-4">
                      <div className="sm:w-1/2 w-full">
                        <h1 className="text-left sm:text-lg text-sm font-semibold ">
                          Pan Front photo
                        </h1>

                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500  focus:border-violet-500"
                          name="pan_frontphoto"
                          type="file"
                          accept="image/*"
                          placeholder="No file choosen"
                          onChange={handleFileChange}
                        />
                      </div>

                      <div className="sm:w-1/2 w-full">
                        <h1 className="text-left sm:text-lg text-sm font-semibold ">
                          Pan Back photo
                        </h1>

                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500  focus:border-violet-500"
                          name="pan_backphoto"
                          type="file"
                          accept="image/*"
                          placeholder="No file choosen"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>

                    <h1 className="text-left sm:text-lg text-sm font-semibold ">
                      Upload Profile Photo
                    </h1>
                    <img src="path/to image" alt="" />
                    <input
                      className="w-full p-4 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500  focus:border-violet-500"
                      name="profilephoto"
                      type="file"
                      accept="image/*"
                      placeholder="No file choosen"
                      onChange={handleFileChange}
                    />
                    <div className="sm:flex gap-3">
                      <button
                        type="button"
                        className="w-40 active:scale-95 font-semibold border-2 border-black shadow-md bg-custom-violet hover:bg-violet-600 text-white p-2 rounded-md"
                        onClick={() => setStep(2)}
                      >
                        Back
                      </button>

                      <button
                        type="button"
                        className="w-40 active:scale-95 font-semibold border-2 border-black shadow-md bg-custom-violet hover:bg-violet-600 text-white p-2 rounded-md"
                        onClick={() => setStep(4)}
                      >
                        Add Bank Details
                      </button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <div className="bg-[#17216D] rounded-md mb-3">
                      <h2 className="p-4 text-left font-bold rounded-md bg-custom-violet text-xl text-white">
                        {" "}
                        Bank Details
                      </h2>
                    </div>

                    <div className="sm:flex gap-4">
                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold ">
                          Bank Name
                        </h2>
                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500  focus:border-violet-500"
                          name="bank_name"
                          type="text"
                          placeholder="Enter Bank Name "
                          value={enrollData?.bank_name}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold">
                          Bank Branch Name
                        </h2>

                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500  focus:border-violet-500"
                          name="bank_branch_name"
                          type="text"
                          placeholder="Enter Bank Branch Name"
                          value={enrollData?.bank_branch_name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="sm:flex gap-4">
                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold ">
                          Bank Account Number
                        </h2>
                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500  focus:border-violet-500"
                          name="bank_account_number"
                          type="text"
                          placeholder="Enter Bank Account Number "
                          value={enrollData?.bank_account_number}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="sm:w-1/2 w-full">
                        <h2 className="text-left sm:text-lg text-sm font-semibold">
                          Bank IFSC Code
                        </h2>

                        <input
                          className="w-full p-2 border rounded-md mb-4 mt-1 sm:text-lg text-sm bg-gray-50 border-gray-300 text-gray-900 focus:ring-violet-500  focus:border-violet-500"
                          name="bank_IFSC_code"
                          type="text"
                          placeholder="Enter Customer Bank IFSC Code"
                          value={enrollData?.bank_IFSC_code}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="sm:flex gap-3">
                      <button
                        type="button"
                        className="w-40 active:scale-95 font-semibold border-2 border-black shadow-md bg-custom-violet hover:bg-violet-600 text-white p-2 rounded-md"
                        onClick={() => setStep(3)}
                      >
                        Back
                      </button>

                      <button
                        type="submit"
                        className="w-40 active:scale-95 font-semibold border-2 border-black shadow-md bg-custom-violet hover:bg-violet-600 text-white p-2 rounded-md"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                )}
              </>
            </div>
          </div>
        </form>
      </div>
    );
  }
};
export default EnrollmentRequestForm;
