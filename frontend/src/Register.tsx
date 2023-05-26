import { Link } from "react-router-dom";
import { useState } from "react";
import { Spinner } from "./components/Spinner";
import logo from "./images/Logo.png";
import forge from "node-forge";
import { useNavigate } from "react-router-dom";
import { api_url } from "./auth/general";

function Register() {
  // const [publicKey, setPublicKey] = useState("");
  // const [privateKey, setPrivateKey] = useState("");
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function registerUser() {
    if (password !== confirmPassword) {
      setIsLoading(false);
      setErrorMessage("Passowrds not Matching");
      return;
    }
    if (name === "" || email === "" || password === "") {
      setIsLoading(false);
      setErrorMessage("Empty Fields");
      return;
    }
    if (password.length < 8) {
      setIsLoading(false);
      setErrorMessage("Password too short");
      return;
    }

    setIsLoading(true);

    const { publicKey, privateKey } = await generateKeys();
    // call the backend to register the user
    const data = {
      email,
      name,
      password,
      public_key: publicKey,
    };

    console.log(JSON.stringify(data));
    console.log(JSON.stringify(publicKey));

    let downloadElement;

    try {
      const response = await fetch(api_url + "/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error registering user");
      }

      const responseData = await response.json();
      console.log(responseData);
      console.log("private key: ", privateKey);

      const element = document.createElement("a");
      const file = new Blob(["PRIVATE KEY:\n" + privateKey], {
        type: "text/plain",
      });
      element.href = URL.createObjectURL(file);
      element.download = "privateKey.pem";
      document.body.appendChild(element);
      element.click();
      element.remove();

      setIsLoading(false);
      navigate("/");
    } catch (err) {
      setIsLoading(false);
      setErrorMessage("Email already in use");
      console.log(err);

      // Remove the download element if it exists
      downloadElement = document.querySelector("a[download='privateKey.pem']");
      if (downloadElement) {
        downloadElement.remove();
      }
    }
  }

  async function generateKeys() {
    const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
    const publicKey = forge.pki.publicKeyToPem(keypair.publicKey);
    const privateKey = forge.pki.privateKeyToPem(keypair.privateKey);
    return { publicKey, privateKey };
  }

  return (
    <div className="lg:flex lg:items-center lg:justify-center lg:h-screen bg-[#ffffff] dark:bg-[#1a1a1a]">
      <div className="flex items-center justify-center lg:w-1/3 lg:flex-col lg:pr-[200px] lg:min-w-[600px]">
        <img className="lg:w-2/3 w-1/4 min-w-[250px]" alt="Logo" src={logo} />
      </div>

      <div className="lg:visible collapse h-[80%] w-[4px] min-w-[4px] rounded-lg bg-gray-100 dark:bg-[#9c9c9c]" />

      <div className="lg:collapse visible flex items-center justify-center">
        <hr className="w-[80%] h-[4px] my-[50px] min-w-[80%] rounded bg-gray-100 dark:bg-[#9c9c9c]" />
      </div>

      <div className="lg:w-1/3 lg:flex-col lg:pl-[200px] lg:min-w-[600px] flex items-center justify-center">
        <form className="shadow-md rounded px-8 pt-6 pb-8 mb-4 bg-white dark:bg-[#242424]">
          <div className="flex items-center justify-center">
            <p className="text-6xl text-[#0B2447] dark:text-[#d9d9d9]">
              Register
            </p>
          </div>
          <div className="flex items-center justify-center pt-3">
            <p className="text-xs font-bold text-black dark:text-[#d9d9d9]">
              WELCOME TO SHARESAFE, LET&apos;S GET STARTED
            </p>
          </div>
          <div className="pt-5 flex items-center justify-center">
            <input
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xl"
              id="name"
              type="text"
              placeholder="Name"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="pt-3 flex items-center justify-center">
            <input
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xl"
              id="email"
              type="email"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="pt-3 flex items-center justify-center">
            <input
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xl"
              id="password"
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="pt-3 pb-2 flex items-center justify-center">
            <input
              className="shadow appearance-none rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xl"
              id="confirmPassword"
              type="password"
              placeholder="Confirm password"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
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

          <div className="flex items-center justify-center pt-10 pb-1 px-[63px]">
            <button
              className="shadow appearance-none rounded w-full py-2 font-bold text-xl text-white dark:text-[#d9d9d9] bg-[#0B2447] hover:bg-[#19376D] dark:bg-[#333333] dark:hover:bg-[#383838]"
              id="registerBtn"
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                registerUser();
              }}
            >
              Register
            </button>
          </div>
          <div className="flex items-center justify-center mt-1">
            <p className="text-xs text-black dark:text-[#d9d9d9]">
              Already have an account? Click{" "}
              <Link
                to="/"
                className="font-bold text-[#E57B1E] dark:text-[#d9d9d9]"
              >
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
