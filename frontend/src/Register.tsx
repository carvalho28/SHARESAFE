import { Link } from "react-router-dom";
import logo from "./images/Logo.png";

function Register() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="pr-[200px]">
        <img alt="Logo" src={logo} />
      </div>

      <div className="h-[80%] bg-gray-100 w-[4px] rounded-lg" />

      <div className="pl-[200px]">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div>
            <p className="text-6xl text-blue-900">Register</p>
          </div>
          <div className="pt-3">
            <p className="text-xs font-bold">
              WELCOME TO SHARESAFE, LET&apos;S GET STARTED
            </p>
          </div>
          <div className="pt-5">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xl"
              id="RGTnome"
              type="text"
              placeholder="Nome"
            />
          </div>
          <div className="pt-5">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xl"
              id="RGTemail"
              type="text"
              placeholder="Email"
            />
          </div>
          <div className="pt-5">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xl"
              id="RGTpassword"
              type="password"
              placeholder="Password"
            />
          </div>
          <div className="pt-5">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xl"
              id="RGTconfirmpassword"
              type="password"
              placeholder="Confirm password"
            />
          </div>
          <div className="md:w-2/3 pt-5">
            <button
              className="shadow appearance-none border rounded w-full py-2 bg-blue-900 hover:bg-blue-600 text-white font-bold text-xl"
              id="registerBtn"
              type="button"
            >
              Register
            </button>
          </div>
          <div className="pt-1">
            <p className="text-xs">
              Already have an account? Click{" "}
              <Link to="/" className="font-bold">
                here.
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
