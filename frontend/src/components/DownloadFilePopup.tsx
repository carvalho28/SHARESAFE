import { ChangeEvent, useEffect, useState } from "react";
import { FaFileAlt, FaKey } from "react-icons/fa";
import { getCookie } from "../auth/Cookies";
import decryptFile from "../encryption/DecryptFile";
import { FileType } from "../subPages/inboxPage";

type filePreview = {
  name: string;
  type: string;
  arrayBuffer: ArrayBuffer | unknown;
};

export default function DownloadFilePopup(props: {
  triggered: boolean;
  setTriggered: Function;
  files: FileType | undefined;
  setFile: Function;
  fileData: any;
  setFileData: Function;
  ownerFile: string;
  signedFile: string;
}) {
  const [digitalSignature, setDigitalSignature] = useState<File | undefined>(
    undefined,
  );

  const [privateKeyPreview, setprivateKeyPreview] = useState<
    filePreview | undefined
  >();

  const [privateKey, setPrivateKey] = useState<String | undefined>(undefined);

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

  const [isVisible, setIsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  // Update the isVisible state when props.triggered changes
  useEffect(() => {
    setIsVisible(props.triggered);
  }, [props.triggered]);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsVisible(false);
      props.setTriggered(false);
    }
  };

  const user_id = getCookie("user_id");

  const handleDownloadClick = async (fileInfo: any, encryptedFile: any) => {
    let encriptedKey;

    fileInfo.users_group.forEach((elem: { id: number; encrypted_key: any }) => {
      if (elem.id === Number(user_id)) {
        encriptedKey = elem.encrypted_key;
      }
    });

    try {
      const receiveData = await decryptFile(
        {
          algorithm: fileInfo.algorithm,
          mac_algorithm: fileInfo.mac_algorithm,
          iv: fileInfo.iv,
          encryptedKey: String(encriptedKey),
          encrypted_file: encryptedFile,
          privateKeyPem: String(privateKey),
        },
        fileInfo.file_type,
        fileInfo.mac,
      );

      // download file
      const element = document.createElement("a");
      const uint8Array = new Uint8Array(receiveData.length);
      for (let i = 0; i < receiveData.length; i++) {
        uint8Array[i] = receiveData.charCodeAt(i);
      }
      const file = new Blob([uint8Array], { type: fileInfo.file_type });
      element.href = URL.createObjectURL(file);
      element.download = fileInfo.file_name;
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
      element.remove();
      setErrorMessage("");
      setShowErrorMessage(false);
    } catch (error) {
      console.log(error);
      setErrorMessage("There was a problem with encryption");
      setShowErrorMessage(true);
    }
  };

  return props.triggered && isVisible ? (
    <div
      className="fixed inset-0 p-4 sm:ml-64 bg-black bg-opacity-5 backdrop-blur-sm 
        flex justify-center items-center"
      onClick={handleOutsideClick}
    >
      <form className="flex items-center justify-center w-8/12">
        <button
          type="button"
          onClick={() => {
            setIsVisible(false);
            props.setTriggered(false);
          }}
          className="absolute top-4 right-4 text-black dark:text-black hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div
          className="px-10 pt-4 flex flex-col items-center justify-center w-full h-full border-2
            border-[#E57B1E] border-dashed rounded-lg cursor-pointer bg-[#0B2447] dark:bg-[#242424]
            dark:border-[#383838] min-w-[500px]"
        >
          <div className="flex flex-row w-full space-x-8">
            <div className="flex w-full justify-between flex-col">
              <h3
                className="text-lg font-medium text-gray-100 text-center
                        flex flex-col items-center flex-center justify-center mb-4"
              >
                Private Key
              </h3>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file-digital-signature"
                  className="flex flex-col items-center justify-center w-full h-44 border-2 border-[#E57B1E] border-dashed rounded-lg cursor-pointer bg-[#0B2447] dark:hover:bg-bray-800 dark:bg-[#242424] hover:bg-[#19376D] dark:border-[#383838] dark:hover:bg-[#333333]"
                >
                  {privateKeyPreview ? (
                    <>
                      {privateKeyPreview.type.includes("image") ? (
                        <>
                          <input
                            id="dropzone-file-digital-signature"
                            type="file"
                            className="hidden"
                            onChange={handleDigitalSignatureChange}
                            // limit a .pem file
                            accept=".pem"
                          />
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
                          <input
                            id="dropzone-file-digital-signature"
                            type="file"
                            className="hidden"
                            onChange={handleDigitalSignatureChange}
                            // limit a .pem file
                            accept=".pem"
                          />
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
                            Click to upload <b>private key</b>
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

          {/* File information */}
          <div className="flex-col items-start justify-center w-full mt-2 px-20 space-y-2 text-white">
            <div className="flex justify-between">
              <h1 className="mr-2 font-bold">Name:</h1>
              <h1 className="text-right">{props.files?.file_name}</h1>
            </div>
            <div className="flex justify-between">
              <h1 className="mr-2 font-bold">Size:</h1>
              <h1 className="text-right">{props.files?.file_size}</h1>
            </div>
            <div className="flex justify-between">
              <h1 className="mr-2 font-bold">Type:</h1>
              <h1 className="text-right">{props.files?.file_type}</h1>
            </div>
            <div className="flex justify-between">
              <h1 className="mr-2 font-bold">Owner:</h1>
              <h1 className="text-right">{props.ownerFile}</h1>
            </div>
            <div className="flex justify-between">
              <h1 className="mr-2 font-bold">Signed:</h1>
              <h1 className="text-right">{props.signedFile}</h1>
            </div>
          </div>

          {showErrorMessage && (
            <div className="justify-center text-center flex text-red-400 mt-10 text-xl">
              Error: {errorMessage}
            </div>
          )}

          <div className="flex flex-col items-center justify-center w-full mt-10">
            <button
              id="btnDownload"
              className="flex items-center justify-center border-2 border-dashed border-[#E57B1E] dark:border-[#383838] my-4 px-2 py-1 rounded hover:bg-19376D hover:bg-[#19376D] dark:hover:bg-[#333333]"
              onClick={(e: any) => {
                e.preventDefault();
                handleDownloadClick(props.files, props.fileData);
              }}
            >
              <p className="text-xl text-gray-100">Download File</p>

              <div className="pl-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="white"
                  className="bi bi-download"
                  viewBox="0 0 16 16"
                >
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </form>
    </div>
  ) : null;
}
