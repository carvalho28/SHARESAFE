import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { exterminateCookies, getCookie, setCookie } from "./auth/Cookies";
import { Spinner } from "./components/Spinner";
import logo from "./images/Logo.png";

function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  // Deletes all cookies
  exterminateCookies();

  async function loginUser() {
    if (password === "" || email === "") {
      console.log("empty fields");
      setErrorMessage("Empty Fields");
      return;
    }

    setIsLoading(true);
    // call the backend to register the user
    const data = {
      email,
      password,
    };

    console.log(JSON.stringify(data));

    await fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.accessToken) {
          setCookie("accessToken", data.accessToken, 7);
          setCookie("user_id", data.id, 7);
          setIsLoading(false);
          navigate("/mainmenu");
        } else {
          setIsLoading(false);
          setErrorMessage("Wrong Credentials");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setErrorMessage("Wrong Credentials");
      });
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-1/3 flex-col pr-[200px]">
        <img alt="Logo" src={logo} />
      </div>

      <div className="h-[80%] bg-gray-100 w-[4px] rounded-lg" />

      <div className="w-1/3 flex-col pl-[200px]">
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
              id="email"
              type="email"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="pt-5">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xl"
              id="password"
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="py-1">
            <p className="text-xs">
              Forgot your password? Click{" "}
              <Link to="/" className="font-bold">
                here
              </Link>
            </p>
          </div>

          {errorMessage != "" && (
            <div
              className="flex items-center justify-center my-3 p-2 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-5 dark:text-red-400 dark:border-red-800"
              role="alert"
            >
              <svg
                aria-hidden="true"
                className="flex-shrink-0 inline w-5 h-5 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Info</span>
              <div>
                <span className="font-medium">{errorMessage}</span>
              </div>
            </div>
          )}

          <div className="md:w-2/3 pt-1">
            <button
              className="shadow appearance-none border rounded w-full py-2 bg-blue-900 hover:bg-blue-600 text-white font-bold text-xl"
              id="loginBtn"
              type="button"
              onClick={() => {
                loginUser();
              }}
            >
              Login
            </button>
          </div>
          {isLoading && (
            <div className="pt-5">
              <Spinner />
            </div>
          )}
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
