import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userLogout } from "../auth/Cookies";
import logo from "../images/Logo.png";
import SendFilePopup from "./SendFilePopup";

export default function Sidebar() {
  const [triggered, setTriggered] = useState(false);

  const navigate = useNavigate();

  return (
    <div>
      <SendFilePopup triggered={triggered} setTriggered={setTriggered} />
      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-1 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul className="space-y-2">
            <li>
              <div className="pr-2">
                <img alt="Logo" src={logo} />
              </div>
            </li>
            <hr />
            <li>
              <button
                onClick={() => setTriggered(true)}
                className="flex w-full border-2 items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 11.08V8l-6-6H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h6" />
                  <path d="M14 3v5h5M18 21v-6M15 18h6" />
                </svg>
                <span className="flex-1 text-left ml-3 whitespace-nowrap">
                  Send File
                </span>
              </button>
            </li>
            <li>
              <Link
                to="/inbox"
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21.5 12H16c-.7 2-2 3-4 3s-3.3-1-4-3H2.5" />
                  <path d="M5.5 5.1L2 12v6c0 1.1.9 2 2 2h16a2 2 0 002-2v-6l-3.4-6.9A2 2 0 0016.8 4H7.2a2 2 0 00-1.8 1.1z" />
                </svg>
                <span className="flex-1 ml-3 whitespace-nowrap">Inbox</span>
              </Link>
            </li>
            <li>
              <Link
                to="/group"
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span className="flex-1 ml-3 whitespace-nowrap">Groups</span>
              </Link>
            </li>
            <li>
              <Link
                to="/help"
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span className="flex-1 ml-3 whitespace-nowrap">Help</span>
              </Link>
            </li>
            <li>
              <span
                className="flex items-center p-2 text-base font-normal
                text-gray-900 rounded-lg dark:text-white hover:bg-gray-100
                dark:hover:bg-gray-700 hover:cursor-pointer"
                onClick={() => userLogout(navigate)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
                </svg>
                <span className="flex-1 ml-3 whitespace-nowrap">Logout</span>
              </span>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
