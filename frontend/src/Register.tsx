import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "./images/Logo.png";
import forge from "node-forge";

function Register() {
  // const [publicKey, setPublicKey] = useState("");
  // const [privateKey, setPrivateKey] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function registerUser() {
    if (password !== confirmPassword) {
      console.log("password not matching");
      setErrorMessage("Passowrds not Matching");
      return;
    }
    if (name === "" || email === "" || password === "") {
      console.log("empty fields");
      setErrorMessage("Empty Fields");
      return;
    }

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

    await fetch("http://localhost:3000/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  async function generateKeys() {
    const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
    const publicKey = forge.pki.publicKeyToPem(keypair.publicKey);
    const privateKey = forge.pki.privateKeyToPem(keypair.privateKey);
    const element = document.createElement("a");
    const file = new Blob(["PRIVATE KEY:\n" + privateKey], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "privateKey.pem";
    document.body.appendChild(element);
    element.click();
    element.remove();
    return { publicKey, privateKey };
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-1/3 flex flex-col pr-[200px] ">
        <img alt="Logo" src={logo} />
      </div>

      <div className="h-[80%] bg-gray-100 w-[4px] rounded-lg" />

      <div className="w-1/3 flex flex-col pl-[200px]">
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
              id="name"
              type="text"
              placeholder="Nome"
              required
              onChange={(e) => setName(e.target.value)}
            />
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
          <div className="pt-5 pb-2">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xl"
              id="confirmPassword"
              type="password"
              placeholder="Confirm password"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
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
              id="registerBtn"
              type="button"
              onClick={() => registerUser()}
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
