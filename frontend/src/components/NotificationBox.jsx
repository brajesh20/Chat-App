import { useDispatch, useSelector } from "react-redux";
import {
  addSelectedChat,
  removeNewMessageRecieved,
} from "../redux/slices/myChatSlice";
import { setNotificationBox } from "../redux/slices/conditionSlice";
import { MdOutlineClose } from "react-icons/md";
import { SimpleDateAndTime } from "../utils/formateDateTime";
import getChatName from "../utils/getChatName";

const NotificationBox = () => {
  const dispatch = useDispatch();
  const authUserId = useSelector((store) => store?.auth?._id);
  const newMessageRecieved = useSelector(
    (store) => store?.myChat?.newMessageRecieved
  );
  console.log("New messages received:", newMessageRecieved);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center px-4 sm:px-0">
      <div className="relative w-full max-w-xl bg-slate-900/90 rounded-xl border border-slate-700 shadow-lg p-6 text-white">
        <h2 className="text-2xl font-bold text-center text-white mb-3 underline underline-offset-4">
          Notifications
        </h2>

        {newMessageRecieved.length > 0 && (
          <p className="text-center text-slate-400 mb-4">
            You have {newMessageRecieved.length} new notification
            {newMessageRecieved.length > 1 ? "s" : ""}
          </p>
        )}

        <div className="max-h-[50vh] overflow-y-auto space-y-3 pr-1 scroll-style">
          {newMessageRecieved.length === 0 ? (
            <div className="text-center text-slate-300 text-sm">
              You have no new notifications
            </div>
          ) : (
            newMessageRecieved.map((message) => (
              <div
                key={message?._id}
                className="border border-slate-600 rounded-lg p-3 bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
                onClick={() => {
                  dispatch(removeNewMessageRecieved(message));
                  dispatch(addSelectedChat(message?.chat));
                  dispatch(setNotificationBox(false));
                }}
              >
                <p className="text-sm font-medium mb-1">
                  <span className="text-sky-400">New message</span>{" "}
                  {message?.chat?.isGroupChat &&
                    "in " + getChatName(message?.chat, authUserId)}{" "}
                  from{" "}
                  <span className="text-green-400">
                    {message?.sender?.firstName}
                  </span>
                </p>
                <p className="text-slate-300 text-sm truncate">
                  {message?.message}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {SimpleDateAndTime(message?.createdAt)}
                </p>
              </div>
            ))
          )}
        </div>

        <button
          title="Close"
          onClick={() => dispatch(setNotificationBox(false))}
          className="absolute top-3 right-4 text-slate-400 hover:text-white transition"
        >
          <MdOutlineClose size={24} />
        </button>
      </div>
    </div>
  );
};

export default NotificationBox;
