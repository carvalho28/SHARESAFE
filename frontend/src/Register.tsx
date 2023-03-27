import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "./images/Logo.png";
import forge from "node-forge";

function Register() {
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");

  function generateKeys() {
    const initTime = new Date().getTime();
    const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
    const publicKey = forge.pki.publicKeyToPem(keypair.publicKey);
    const privateKey = forge.pki.privateKeyToPem(keypair.privateKey);
    setPublicKey(publicKey);
    setPrivateKey(privateKey);
    const endTime = new Date().getTime();
    console.log(publicKey);
    console.log(privateKey);
    console.log(`Time taken: ${endTime - initTime}ms`);

    const element = document.createElement("a");
    const file = new Blob(["PRIVATE KEY:\n"+privateKey], {
      type: "text/plain"
    });
    element.href = URL.createObjectURL(file);
    element.download = "privateKey.pem";
    document.body.appendChild(element);
    element.click();
    element.remove();
    
  }

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
          <div>
            {/* TO REMOVE LATER */}
            {publicKey ? <p>{publicKey}</p> : <p>Public key not generated</p>}
            {privateKey ? (
              <p>{privateKey}</p>
            ) : (
              <p>Private key not generated</p>
            )}
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
              onClick={generateKeys}
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
