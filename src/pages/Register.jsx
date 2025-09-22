import { useState } from "react";
import { AiOutlineGold } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import api from "../instance/TokenInstance";

const Register = () => {
  const [companyName, setCompanyName] = useState("");
  const [companyContact, setCompanyContact] = useState("");
  const [password, setPassword] = useState(""); 
  const [branches, setBranches] = useState([
    { branch_name: "", address: "", pincode: "", state: "", country: "" },
  ]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleBranchChange = (index, field, value) => {
    const newBranches = [...branches];
    newBranches[index][field] = value;
    setBranches(newBranches);
  };

  const addBranch = () => {
    setBranches([
      ...branches,
      { branch_name: "", address: "", pincode: "", state: "", country: "" },
    ]);
  };

  const removeBranch = (index) => {
    const newBranches = branches.filter((_, i) => i !== index);
    setBranches(newBranches);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!companyName.trim() || !companyContact.trim() || !password.trim()) {
      setError("Company Name, Contact, and Password are required.");
      return;
    }

    for (let i = 0; i < branches.length; i++) {
      if (!branches[i].branch_name.trim()) {
        setError(`Branch ${i + 1}: Branch Name is required.`);
        return;
      }
    }

    try {
      setLoading(true);
      const response = await api.post("/admin/register", {
        company_name: companyName,
        company_contact_number: companyContact,
        password, 
        branches,
      });

      console.log("Register success:", response.data);
      alert("Company Registered! Use your contact number and the chosen password to login.");
      navigate("/");
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-28 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <AiOutlineGold className="mx-auto text-5xl text-violet-500" />
        <h2 className="mt-6 text-2xl font-bold text-gray-900">
          Register Company & Branch
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              className="mt-2 block w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Company Contact</label>
            <input
              type="text"
              value={companyContact}
              onChange={(e) => setCompanyContact(e.target.value)}
              required
              className="mt-2 block w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 block w-full rounded-md border px-3 py-2"
              placeholder="Set a password for login"
            />
          </div>

          <h3 className="font-semibold text-gray-700 mt-4">Branches</h3>
          {branches.map((branch, index) => (
            <div
              key={index}
              className="p-4 border rounded-md bg-white space-y-2 relative"
            >
              {branches.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeBranch(index)}
                  className="absolute top-2 right-2 text-red-500 font-bold"
                  title="Remove Branch"
                >
                  &times;
                </button>
              )}
              <input
                type="text"
                placeholder="Branch Name"
                value={branch.branch_name}
                onChange={(e) => handleBranchChange(index, "branch_name", e.target.value)}
                required
                className="block w-full rounded-md border px-3 py-2"
              />
              <input
                type="text"
                placeholder="Address"
                value={branch.address}
                onChange={(e) => handleBranchChange(index, "address", e.target.value)}
                className="block w-full rounded-md border px-3 py-2"
              />
              <input
                type="text"
                placeholder="Pincode"
                value={branch.pincode}
                onChange={(e) => handleBranchChange(index, "pincode", e.target.value)}
                className="block w-full rounded-md border px-3 py-2"
              />
              <input
                type="text"
                placeholder="State"
                value={branch.state}
                onChange={(e) => handleBranchChange(index, "state", e.target.value)}
                className="block w-full rounded-md border px-3 py-2"
              />
              <input
                type="text"
                placeholder="Country"
                value={branch.country}
                onChange={(e) => handleBranchChange(index, "country", e.target.value)}
                className="block w-full rounded-md border px-3 py-2"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addBranch}
            className="w-full rounded-md border px-3 py-2 bg-gray-200 hover:bg-gray-300 text-sm font-medium"
          >
            + Add Another Branch
          </button>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-violet-500 px-3 py-2 text-white font-semibold hover:bg-violet-600 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-sm text-center mt-4 text-gray-700">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/")}
              className="font-semibold text-violet-500 cursor-pointer"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
