import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { checkValidSignUpFrom } from "../utils/validate";
import { PiEye, PiEyeClosedLight } from "react-icons/pi";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [load, setLoad] = useState("");
  const [isShow, setIsShow] = useState(false);
  const navigate = useNavigate();

  const signUpUser = (e) => {
    toast.loading("Wait until you SignUp");
    e.target.disabled = true;
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password }),
    })
      .then((res) => res.json())
      .then((json) => {
        setLoad("");
        e.target.disabled = false;
        toast.dismiss();
        if (json.token) {
          navigate("/signin");
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

  const handleSignup = (e) => {
    if (firstName && lastName && email && password) {
      const validError = checkValidSignUpFrom(
        firstName,
        lastName,
        email,
        password
      );
      if (validError) {
        toast.error(validError);
        return;
      }
      setLoad("Loading...");
      signUpUser(e);
    } else {
      toast.error("Required: All Fields");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-4">
      <div className="w-full max-w-md bg-slate-800/90 backdrop-blur-md border border-slate-600 rounded-xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-white tracking-wide">
          Sign Up
        </h2>

        <form className="space-y-6">
          <div>
            <label className="text-sm font-medium text-slate-300">
              First Name
            </label>
            <input
              type="text"
              placeholder="Enter first name"
              className="mt-2 w-full px-4 py-3 rounded-md bg-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Enter last name"
              className="mt-2 w-full px-4 py-3 rounded-md bg-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              className="mt-2 w-full px-4 py-3 rounded-md bg-slate-700 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300">
              Password
            </label>
            <div className="relative mt-2">
              <input
                type={isShow ? "text" : "password"}
                placeholder="Enter password"
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
              handleSignup(e);
            }}
            className="w-full py-3 rounded-md bg-sky-600 hover:bg-sky-700 transition-all font-semibold tracking-wide text-white"
            disabled={load !== ""}
          >
            {load || "Sign Up"}
          </button>

          <div className="text-center text-sm text-slate-400 mt-4">
            Already have an account?{" "}
            <Link to="/signin" className="text-sky-400 hover:underline">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
