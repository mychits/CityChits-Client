import { useState } from "react";
import { AiOutlineGold } from "react-icons/ai";
import { useNavigate, Link } from "react-router-dom";
import api from "../instance/TokenInstance";

const Register = () => {
  const [companyName, setCompanyName] = useState("");
  const [companyContact, setCompanyContact] = useState("");
  const [branches, setBranches] = useState([
    { address: "", pincode: "", state: "", country_code: "" },
  ]);
  const [adminName, setAdminName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleBranchChange = (i, field, value) => {
    const copy = [...branches];
    copy[i][field] = value;
    setBranches(copy);
  };

  const addBranch = () =>
    setBranches([
      ...branches,
      { address: "", pincode: "", state: "", country_code: "" },
    ]);

  const removeBranch = (i) =>
    setBranches(branches.filter((_, idx) => idx !== i));

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await api.post("/admin/register-company", {
//         company_name: companyName,
//         company_contact_number: companyContact,
//         company_branches: branches,
//         admin_name: adminName,
//         phoneNumber,
//         password,
//       });
//       if (response.status === 201) {
//         navigate("/login");
//       }
//     } catch (err) {
//       setError("Registration failed. Try again.");
//     }
//   };

const handleRegister = async (e) => {
  e.preventDefault();
  if (loading) return;  
  setError("");
  setLoading(true);

  try {
    const response = await api.post("/admin/register-company", {
      company_name: companyName,
      company_contact_number: companyContact,
      company_branches: branches,
      admin_name: adminName,
      phoneNumber,
      password,
    });

    if (response.status === 201) {
      navigate("/dashboard");
    }
  } catch (err) {
    const msg = err.response?.data?.message || "Registration failed. Try again.";
    setError(msg);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-28 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <AiOutlineGold className="mx-auto text-5xl h-25 w-auto text-primary" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 text-gray-900">
          Register your Company
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleRegister} className="space-y-6">
         
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Company Name
            </label>
            <input
              type="text"
              disabled={loading}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-red-100 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
              Company Contact Number
            </label>
            <input
              type="text"
              disabled={loading}
              value={companyContact}
              onChange={(e) => setCompanyContact(e.target.value)}
              required
              className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-red-100 sm:text-sm"
            />
          </div>

   
          <h3 className="text-md font-semibold">Branch Details</h3>
          {branches.map((b, i) => (
            <div key={i} className="p-3 border rounded-md space-y-2">
              <input
                type="text"
                disabled={loading}
                placeholder="Address"
                value={b.address}
                onChange={(e) =>
                  handleBranchChange(i, "address", e.target.value)
                }
                className="block w-full rounded-md border-0 py-1 px-2 shadow-sm ring-1 ring-gray-300"
              />
              <input
                type="text"
                placeholder="Pincode"
                disabled={loading}
                value={b.pincode}
                onChange={(e) =>
                  handleBranchChange(i, "pincode", e.target.value)
                }
                className="block w-full rounded-md border-0 py-1 px-2 shadow-sm ring-1 ring-gray-300"
              />
              <input
                type="text"
                placeholder="State"
                value={b.state}
                disabled={loading}
                onChange={(e) =>
                  handleBranchChange(i, "state", e.target.value)
                }
                className="block w-full rounded-md border-0 py-1 px-2 shadow-sm ring-1 ring-gray-300"
              />
              <input
                type="text"
                disabled={loading}
                placeholder="Country Code"
                value={b.country_code}
                onChange={(e) =>
                  handleBranchChange(i, "country_code", e.target.value)
                }
                className="block w-full rounded-md border-0 py-1 px-2 shadow-sm ring-1 ring-gray-300"
              />

              {branches.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeBranch(i)}
                  className="text-red-500 text-sm mt-1"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addBranch}
            className="text-sm text-primary"
          >
            + Add Another Branch
          </button>

         
          <h3 className="text-md font-semibold">Admin Details</h3>
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Admin Name
            </label>
            <input
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              required
              disabled={loading}
              className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-red-100 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
              Phone Number
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              disabled={loading}
              className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-red-100 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-red-100 sm:text-sm"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-700"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/dashboard"
            className="font-semibold text-primary hover:text-red-500"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
