import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../elements/button/indeks";

const NavbarLinks = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="py-2 px-6 shadow-md sticky top-0 z-[300] bg-white">
      <div className="flex flex-row items-center gap-2 justify-between px-4 py-3 container max-w-[900px]">
        <div className="flex gap-2 items-center">
          <img
            src="/assets/images/logo.png"
            alt="Logo Kedai Susu Tuli"
            className="w-10"
          />
          <div>
            <h1 className="text-black text-xl">K-Suli</h1>
            <p className="text-accent">Kedai Susu Tuli</p>
          </div>
        </div>
        <div className="hidden lg:flex space-x-4">
          <Button
            className={`py-2 px-4 rounded ${isActive("/") ? " text-secondary" : "bg-transparent text-black"
              } hover:bg-neutral`}
            type="button"
            onClick={() => navigate("/")}
          >
            Home
          </Button>
          <Button
            className={`py-2 px-4 rounded ${isActive("/kosakata") ? " text-secondary" : "bg-transparent text-black"
              } hover:bg-neutral`}
            type="button"
            onClick={() => navigate("/kosakata")}
          >
            Kosa Kata
          </Button>
          {/* <Button
            className={`py-2 px-4 rounded ${isActive("/testing2") ? " text-secondary" : "bg-transparent text-black"
              } hover:bg-neutral`}
            type="button"
            onClick={() => navigate("/testing2")}
          >
            Testing
          </Button> */}

        </div>
        <div className="dropdown dropdown-end lg:hidden">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-square text-black hover:bg-gray-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M12 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content items-end bg-base-100 text-black bg-white rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Button
                className={`bg-transparent p-2 ${isActive("/") ? "text-secondary" : "text-black  "} hover:bg-neutral`}
                type="button"
                onClick={() => navigate("/")}
              >
                Home
              </Button>
            </li>
            <li>
              <Button
                className={`bg-transparent p-2 ${isActive("/kosakata") ? "text-secondary" : "text-black  "} hover:bg-neutral`}
                type="button"
                onClick={() => navigate("/kosakata")}
              >
                Kosa Kata
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

  );
};

export default NavbarLinks;