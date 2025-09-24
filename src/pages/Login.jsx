import { useState, useEffect } from "react";
import { AiOutlineLogin } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import api from "../instance/TokenInstance";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Step 1: Check localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const admin = localStorage.getItem("admin");

    if (token && admin) {
      // Already logged in → redirect to dashboard
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!phoneNumber.trim() || !password.trim()) {
      setError("Please enter both phone number and password.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/admin/login", { phoneNumber, password });

      // ✅ Save token & admin to localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("admin", JSON.stringify(response.data.admin));

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-28 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <AiOutlineLogin className="mx-auto text-5xl text-violet-500" />
        <h2 className="mt-6 text-2xl font-bold text-gray-900">Admin Login</h2>
        <p className="text-sm text-gray-600 mt-2">
          Use <strong>Company Contact Number</strong> and the password you set during registration
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company Contact Number
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="mt-2 block w-full rounded-md border px-3 py-2"
              placeholder="Enter your company contact number"
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
              placeholder="Enter your password"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-violet-500 px-3 py-2 text-white font-semibold hover:bg-violet-600 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-sm text-center mt-4 text-gray-700">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="font-semibold text-violet-500 cursor-pointer"
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
