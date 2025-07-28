import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addAuth } from "../redux/slices/authSlice";
import { checkValidSignInFrom } from "../utils/validate";
import { PiEye, PiEyeClosedLight } from "react-icons/pi";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [load, setLoad] = useState("");
  const [isShow, setIsShow] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logInUser = (e) => {
    toast.loading("Wait until you SignIn");
    e.target.disabled = true;
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((json) => {
        setLoad("");
        e.target.disabled = false;
        toast.dismiss();
        if (json.token) {
          localStorage.setItem("token", json.token);
          dispatch(addAuth(json.data));
          navigate("/");
          toast.success(json?.message);
        } else {
          toast.error(json?.message);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoad("");
        toast.dismiss();
        toast.error("Error: " + err.code);
        e.target.disabled = false;
      });
  };

  const handleLogin = (e) => {
    if (email && password) {
      const validError = checkValidSignInFrom(email, password);
      if (validError) {
        toast.error(validError);
        return;
      }
      setLoad("Loading...");
      logInUser(e);
    } else {
      toast.error("Required: All Fields");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-4">
      <div className="w-full max-w-md bg-slate-800/90 backdrop-blur-md border border-slate-600 rounded-xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-white tracking-wide">Sign In</h2>

        <form className="space-y-6">
          <div>
            <label className="text-sm font-medium text-slate-300">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="mt-2 w-full px-4 py-3 rounded-md bg-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300">Password</label>
            <div className="relative mt-2">
              <input
                type={isShow ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-md bg-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={() => setIsShow(!isShow)}
                className="absolute right-3 top-3.5 text-white/70 cursor-pointer"
              >
                {isShow ? <PiEyeClosedLight size={20} /> : <PiEye size={20} />}
              </span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              handleLogin(e);
            }}
            className="w-full py-3 rounded-md bg-sky-600 hover:bg-sky-700 transition-all font-semibold tracking-wide text-white"
            disabled={load !== ""}
          >
            {load || "Sign In"}
          </button>

          <div className="text-center text-sm text-slate-400 mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-sky-400 hover:underline">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
