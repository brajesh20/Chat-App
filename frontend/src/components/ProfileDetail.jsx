import React from "react";
import { MdOutlineClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setProfileDetail } from "../redux/slices/conditionSlice";
import { toast } from "react-toastify";

const ProfileDetail = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.auth);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6 text-slate-800 dark:text-slate-200">
        {/* Close Button */}
        <button
          onClick={() => dispatch(setProfileDetail())}
          className="absolute top-4 right-4 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 p-1 rounded-full"
          title="Close"
        >
          <MdOutlineClose size={20} />
        </button>

        {/* Profile Header */}
        <h2 className="text-2xl font-bold text-center mb-6 border-b pb-2">
          Your Profile
        </h2>

        {/* Profile Content */}
        <div className="flex flex-col items-center justify-center text-center gap-4">
          {/* Profile Image */}
          <img
            src={user.image}
            alt="Profile"
            className="w-28 h-28 object-cover rounded-full shadow-md"
          />

          {/* Info */}
          <div>
            <h3 className="text-xl font-semibold capitalize mb-1">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              {user.email}
            </p>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
