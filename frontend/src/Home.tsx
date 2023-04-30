import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { exterminateCookies, getCookie, setCookie } from "./auth/Cookies";
import { Spinner } from "./components/Spinner";
import logo from "./images/Logo.png";

function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  // Deletes all cookies
  exterminateCookies();

  async function loginUser() {
    if (password === "" || email === "") {
      // error message of empty fields
      console.log("empty fields");
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
          setIsLoading(false);
          navigate("/mainmenu");
        } else {
          // error message of wrong credentials
          console.log("wrong credentials");
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

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
