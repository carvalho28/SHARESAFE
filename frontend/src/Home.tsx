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
          console.log("login successful");
          setCookie("accessToken", data.accessToken, 7);
          setCookie("user_id", data.id, 7);
          setIsLoading(false);
          navigate("/inbox");
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
    <div className="lg:flex lg:items-center lg:justify-center lg:h-screen bg-[#ffffff] dark:bg-[#1a1a1a]">
      <div className="lg:w-1/3 lg:flex-col lg:pr-[200px] flex items-center justify-center">
        <img className="lg:w-2/3 w-1/4 min-w-[250px]" alt="Logo" src={logo} />
      </div>

      <div className="collapse lg:visible h-[80%] w-[4px] min-w-[4px] rounded-lg bg-gray-100 dark:bg-[#9c9c9c]" />

      <div className="lg:collapse visible flex items-center justify-center">
        <hr className="w-[80%] h-[4px] my-[50px] min-w-[80%] rounded bg-gray-100 dark:bg-[#9c9c9c]" />
      </div>

      <div className="lg:w-1/3 lg:flex-col lg:pl-[200px] flex items-center justify-center">
        <form className="shadow-lg rounded px-8 pt-6 pb-6 mb-4 bg-white dark:bg-[#242424]">
          <div className="flex items-center justify-center">
            <p className="text-6xl text-[#0B2447] dark:text-[#d9d9d9]">Login</p>
          </div>
          <div className="pt-3 flex items-center justify-center">
            <p className="text-xs font-bold text-black dark:text-[#d9d9d9]">
              WELCOME BACK TO SHARESAFE
            </p>
          </div>
          <div className="pt-5 flex items-center justify-center">
            <input
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xl"
              id="email"
              type="email"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="pt-3 pb-2 flex items-center justify-center">
            <input
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xl"
              id="password"
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {errorMessage != "" && (
            <div
              className="flex items-center justify-center mt-3 p-2 mx-[64px] text-l text-red-800 border border-red-300 rounded-lg bg-red-5 dark:text-red-400 dark:border-red-800"
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

          {isLoading && (
            <div className="flex items-center justify-center mt-3">
              <Spinner />
            </div>
          )}

          <div className="flex items-center justify-center pt-10 px-[63px]">
            <button
              type="submit"
              className="shadow appearance-none rounded w-full py-2 font-bold text-xl bg-[#0B2447] hover:bg-[#19376D] text-white dark:text-[#d9d9d9] dark:bg-[#333333] dark:hover:bg-[#383838]"
              id="loginBtn"
              onClick={(e) => {
                e.preventDefault();
                loginUser();
              }}
            >
              Login
            </button>
          </div>
          <div className="flex items-center justify-center mt-1">
            <p className="text-xs text-black dark:text-[#d9d9d9]">
              Don&apos;t have an account? Click{" "}
              <Link to="register" className="font-bold text-[#E57B1E] dark:text-[#d9d9d9]">
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
