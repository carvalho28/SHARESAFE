import { ChangeEvent, useEffect, useState } from "react";
import sendFile, { typesEnc } from "../encryption/SendFile";
import { FaFileAlt, FaKey } from "react-icons/fa";
import Dropdown from "./Dropdown";
import { getCookie } from "../auth/Cookies";
import forge from "node-forge";

type filePreview = {
  name: string;
  type: string;
  arrayBuffer: ArrayBuffer | unknown;
};

const algorithmEncOptions = [
  { value: "AES-CBC", label: "AES-CBC" },
  { value: "AES-ECB", label: "AES-ECB" },
  { value: "AES-CFB", label: "AES-CFB" },
  { value: "AES-OFB", label: "AES-OFB" },
  { value: "AES-CTR", label: "AES-CTR" },
  { value: "AES-GCM", label: "AES-GCM" },
  { value: "3DES-ECB", label: "3DES-ECB" },
  { value: "3DES-CBC", label: "3DES-CBC" },
  { value: "DES-ECB", label: "DES-ECB" },
  { value: "DES-CBC", label: "DES-CBC" },
];

const algorithmMDOptions = [
  { value: "SHA1", label: "SHA1" },
  { value: "SHA256", label: "SHA256" },
  { value: "SHA384", label: "SHA384" },
  { value: "SHA512", label: "SHA512" },
  { value: "MD5", label: "MD5" },
];

export default function SendFilePopup(props: {
  triggered: boolean;
  setTriggered: Function;
}) {
  const [file, setFile] = useState<File>();
  const [filePreview, setFilePreview] = useState<filePreview | undefined>();
  const [digitalSignature, setDigitalSignature] = useState<File | undefined>(
    undefined,
  );
  const [privateKeyPreview, setprivateKeyPreview] = useState<
    filePreview | undefined
  >();

  const [ownKey, setOwnKey] = useState<boolean>(false);
  const [useDiffie, setUseDiffie] = useState<boolean>(false);

  const [ownKeyInput, setOwnKeyInput] = useState<string>("");

  const [signFile, setSignFile] = useState<boolean>(false);

  const [algorithm_sign, setAlgorithm_sign] = useState<string>(
    algorithmMDOptions[0].value,
  );
  const [algorithm_encrypt, setAlgorithm_encrypt] =
    useState<forge.cipher.Algorithm>("AES-CBC");
  const [algorithm_hmac, setAlgorithm_hmac] =
    useState<forge.md.Algorithm>("sha256");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    console.log(e.target.files);
    const file = e.target.files[0];
    setFile(file);
    // set file preview
    const reader = new FileReader();

    reader.addEventListener("load", function () {
      // setFilePreview(reader.result);
      setFilePreview({
        name: file.name,
        type: file.type,
        arrayBuffer: reader.result as ArrayBuffer,
      });
    });

    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const [privateKey, setPrivateKey] = useState<String | undefined>(undefined);

  const handleAlgorithmChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "algorithm-Sign") {
      setAlgorithm_sign(e.target.value);
    }
    if (e.target.name === "algorithm-Encrypt") {
      setAlgorithm_encrypt(e.target.value as forge.cipher.Algorithm);
    }
    if (e.target.name === "algorithm-HMAC") {
      setAlgorithm_hmac(e.target.value as forge.md.Algorithm);
    }
  };

  const handleDigitalSignatureChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setDigitalSignature(file);

    // set file preview
    const reader = new FileReader();

    reader.onload = async (e: any) => {
      const dataURL = e.target.result;
      const text = atob(dataURL.split(",")[1]); // <-- decode the data URL
      console.log("text", text);
      var lines = text?.split("\n");
      lines?.splice(0, 1);
      var newtext = lines?.join("\n");
      console.log("newtext", newtext);
      setPrivateKey(newtext as string);
    };

    reader.addEventListener("load", function () {
      // setFilePreview(reader.result);
      setprivateKeyPreview({
        name: file.name,
        type: file.type,
        arrayBuffer: reader.result as ArrayBuffer,
      });
    });

    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const [diffieKey, setDiffieKey] = useState<string | undefined>(undefined);

  // async function to get diffie hellman key
  const getDiffieHellmanKey = async () => {
    const body = {
      user_id: getCookie("user_id"),
      group_id: 69,
    };
    const response = await fetch(
      "http://localhost:3000/api/groups/getDiffieKey",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(body),
      },
    )
      .then((res) => res.json())
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.log(err.message);
      });
    return response;
  };

  useEffect(() => {
    getDiffieHellmanKey().then((response) => {
      setDiffieKey(response.diffie_key);
    });
  }, []);

  return props.triggered ? (
    <div
      className="fixed inset-0 p-4 sm:ml-64 bg-black bg-opacity-5 backdrop-blur-sm 
    flex justify-center items-center"
    >
      <form className="flex items-center justify-center w-8/12">
        <div
          className="px-10 pt-4 flex flex-col items-center justify-center w-full h-full border-2
          border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700
          dark:border-gray-600"
        >
          <div className="flex flex-row w-full space-x-8">
            <div className="flex w-1/2 flex-col">
              <h3
                className="text-lg font-medium text-gray-900 dark:text-gray-100 text-center 
                        flex flex-col items-center flex-center justify-center mb-4"
              >
                Upload File
              </h3>
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-44 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                {filePreview ? (
                  <>
                    {filePreview.type.includes("image") ? (
                      <div className="flex flex-col items-center justify-center w-42 h-42">
                        <img
                          src={filePreview.arrayBuffer as string}
                          alt="file preview"
                          className="object-fit w-32 h-32 p-4"
                        />
                        <p className="text-lg text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">
                            {filePreview.name}
                          </span>
                        </p>
                      </div>
                    ) : (
                      // show file icon with file name
                      <div className="flex flex-col items-center justify-center w-full h-44">
                        {/* file icon from react-icons */}
                        <div className="text-6xl text-gray-400">
                          <FaFileAlt />
                        </div>
                        <p className="mb-2 text-lg text-gray-500 dark:text-gray-400 mt-4">
                          <span className="font-semibold">
                            {filePreview.name}
                          </span>
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-center justify-center text-center pt-5 pb-6">
                      <svg
                        aria-hidden="true"
                        className="w-10 h-10 mb-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </>
                )}
              </label>
            </div>
            <div className="flex w-1/2 justify-between flex-col">
              <h3
                className="text-lg font-medium text-gray-900 dark:text-gray-100 text-center
                        flex flex-col items-center flex-center justify-center mb-4"
              >
                Private Key
              </h3>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file-digital-signature"
                  className="flex flex-col items-center justify-center w-full h-44 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                  {privateKeyPreview ? (
                    <>
                      {privateKeyPreview.type.includes("image") ? (
                        <>
                          <img
                            src={privateKeyPreview.arrayBuffer as string}
                            alt="file preview"
                            className="w-full h-full object-contain p-10"
                          />
                          <p className="mb-2 text-lg text-gray-500 dark:text-gray-400 mt-4">
                            <span className="font-semibold">
                              {privateKeyPreview.name}
                            </span>
                          </p>
                        </>
                      ) : (
                        // show file icon with file name
                        <div className="flex flex-col items-center justify-center w-full h-full">
                          {/* file icon from react-icons */}
                          <div className="text-6xl text-gray-400">
                            <FaKey />
                          </div>
                          <p className="mb-2 text-lg text-gray-500 dark:text-gray-400 mt-4">
                            <span className="font-semibold">
                              {privateKeyPreview.name}
                            </span>
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                        <svg
                          aria-hidden="true"
                          className="w-10 h-10 mb-3 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          ></path>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">
                            Click to upload digital signature
                          </span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PEM file
                        </p>
                      </div>
                      <input
                        id="dropzone-file-digital-signature"
                        type="file"
                        className="hidden"
                        onChange={handleDigitalSignatureChange}
                        // limit a .pem file
                        accept=".pem"
                      />
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center w-full mt-2 space-x-20">
            {/* checkbox to enable sign file */}
            <div className="flex items-center justify-center flex-col mt-8">
              <div className="flex flex-row items-center justify-center">
                <input
                  type="checkbox"
                  id="sign-file"
                  name="sign-file"
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  checked={signFile}
                  onChange={(e) => setSignFile(e.target.checked)}
                />
                <label
                  htmlFor="sign-file"
                  className="block ml-2 text-sm text-gray-900 dark:text-gray-100"
                >
                  Sign File
                </label>
              </div>
              <div className="flex flex-col items-center justify-center">
                {signFile && (
                  <div className="mt-8">
                    <Dropdown
                      label="Algorithm to Sign"
                      name="algorithm-Sign"
                      onSelect={handleAlgorithmChange}
                      defaultValue={algorithmMDOptions[1]}
                      items={algorithmMDOptions}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="mt-20">
              <Dropdown
                label="Algorithm to Encrypt"
                name="algorithm-Encrypt"
                onSelect={handleAlgorithmChange}
                defaultValue={algorithmEncOptions[0]}
                items={algorithmEncOptions}
              />
            </div>
            <div className="mt-20">
              <Dropdown
                label="Algorithm to HMAC"
                name="algorithm-HMAC"
                onSelect={handleAlgorithmChange}
                defaultValue={algorithmMDOptions[1]}
                items={algorithmMDOptions}
              />
            </div>
          </div>
          <div className="flex items-center justify-center w-full space-x-20 mt-8">
            <div className="flex items-center justify-center">
              <label
                htmlFor="generatedKey"
                className="text-sm font-medium text-gray-900 dark:text-white mr-2"
              >
                Use own key
              </label>
              <input
                checked={ownKey}
                type="checkbox"
                id="generatedKey"
                onChange={(e) => {
                  if (e.target.checked) {
                    setUseDiffie(false);
                  }
                  setOwnKey(e.target.checked);
                }}
                className="w-4 h-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
              />
            </div>

            {ownKey ? (
              <div className="flex items-center justify-center w-1/2">
                <label
                  htmlFor="default-input"
                  className="text-sm font-medium text-gray-900 dark:text-white mr-4"
                >
                  Key
                </label>
                <input
                  value={ownKeyInput}
                  onChange={(e) => setOwnKeyInput(e.target.value)}
                  type="text"
                  id="default-input"
                  className="bg-gray-50 border border-gray-300 text-gray-900 
              text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 
              block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
              dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500
               dark:focus:border-blue-500 "
                />
              </div>
            ) : null}
          </div>

          {/* checkbox to useDiffie */}
          <div className="flex items-center justify-center w-full mt-6">
            <div className="flex items-center justify-center">
              <label
                htmlFor="useDiffie"
                className="text-sm font-medium text-gray-900 dark:text-white mr-2"
              >
                Use diffie-hellman
              </label>
              <input
                checked={useDiffie}
                type="checkbox"
                id="useDiffie"
                onChange={(e) => {
                  // if ownKey is checked, uncheck it
                  if (ownKey) {
                    setOwnKey(false);
                  }
                  setUseDiffie(e.target.checked);
                }}
                className="w-4 h-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center w-full mt-2">
            <button
              id="btnSend"
              className="flex items-center justify-center border-2 my-4 px-2 py-1 rounded hover:bg-gray-600"
              onClick={(event) => {
                let encType: typesEnc;
                if (ownKey) {
                  encType = "userKey";
                } else if (useDiffie) {
                  encType = "diffie";
                } else {
                  encType = "random";
                }
                event.preventDefault();
                sendFile(
                  encType,
                  ownKeyInput,
                  String(privateKey),
                  diffieKey!,
                  file!,
                  1,
                  signFile ? digitalSignature : undefined,
                  algorithm_encrypt,
                  algorithm_sign,
                  algorithm_hmac,
                ).catch((error) => {
                  console.error("Error sending file:", error);
                });
                //clear file input
                setFile(undefined);
                setFilePreview(undefined);
                setDigitalSignature(undefined);
                setprivateKeyPreview(undefined);

                setOwnKey(false);
                setOwnKeyInput("");
                setUseDiffie(false);
                setDiffieKey(undefined);
              }}
            >
              <p className="text-xl text-gray-500 dark:text-gray-300">
                Send <span className="font-semibold">File</span>
              </p>

              <div className="pl-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  fill="currentColor"
                  className="bi bi-send text-gray-300"
                  viewBox="0 0 16 16"
                >
                  <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </form>
    </div>
  ) : null;
}
