import { Link } from "react-router-dom";
import logo from "./images/Logo.png";

function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="pr-[200px]">
        <img alt="Logo" src={logo} />
      </div>

      <div className="h-[80%] bg-gray-100 w-[4px] rounded-lg" />

      <div className="pl-[200px]">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div>
            <p className="text-6xl text-blue-900">Login</p>
          </div>
          <div className="pt-3">
            <p className="text-xs font-bold">WELCOME BACK TO SHARESAFE</p>
          </div>
          <div className="pt-5">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xl"
              id="LGNnome"
              type="text"
              placeholder="Nome"
            />
          </div>
          <div className="pt-5">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xl"
              id="LGNpassword"
              type="password"
              placeholder="Password"
            />
          </div>
          <div className="pt-1">
            <p className="text-xs">
              Forgot your password? Click{" "}
              <Link to="/" className="font-bold">
                here
              </Link>
            </p>
          </div>
          <div className="md:w-2/3 pt-5">
            <button
              className="shadow appearance-none border rounded w-full py-2 bg-blue-900 hover:bg-blue-600 text-white font-bold text-xl"
              id="loginBtn"
              type="button"
            >
              Login
            </button>
          </div>
          <div className="pt-1">
            <p className="text-xs">
              Don&apos;t have an account? Click{" "}
              <Link to="register" className="font-bold">
                here.
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Home;
