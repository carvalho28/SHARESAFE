import React, { ChangeEvent, useState } from "react";
import sendFile from "../encryption/SendFile";
import { FaFileAlt, FaKey } from "react-icons/fa";

type filePreview = {
  name: string;
  type: string;
  arrayBuffer: ArrayBuffer | unknown;
};

export default function SendFilePopup(props: {
  triggered: boolean;
  setTriggered: Function;
}) {
  const [file, setFile] = useState<File>();
  const [filePreview, setFilePreview] = useState<filePreview | undefined>();
  // const [fileName, setFileName] = useState<string>("");
  const [digitalSignature, setDigitalSignature] = useState<File | undefined>(
    undefined,
  );
  const [digitalSignaturePreview, setDigitalSignaturePreview] = useState<
    filePreview | undefined
  >();

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

  const handleDigitalSignatureChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setDigitalSignature(file);
    // set file preview
    const reader = new FileReader();

    reader.addEventListener("load", function () {
      // setFilePreview(reader.result);
      setDigitalSignaturePreview({
        name: file.name,
        type: file.type,
        arrayBuffer: reader.result as ArrayBuffer,
      });
    });

    reader.readAsDataURL(file);

    e.target.value = "";
  };

  return props.triggered ? (
    <div
      className="fixed inset-0 p-4 sm:ml-64 bg-black bg-opacity-5 backdrop-blur-sm 
    flex justify-center items-center"
    >
      {/* <button onClick={() => sendFile(file, 1)}>teste</button> */}
      <form className="flex items-center justify-center w-8/12">
        {/* <div className="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700  dark:border-gray-600 ">
            <button
              onClick={() => props.setTriggered(false)}
              className="text-white place-self-end"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25 "
                height="25"
                fill="currentColor"
                className="bi bi-x-circle"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
              </svg>
            </button>

            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center pt-5 pb-6 px-10 dark:hover:bg-gray-600 rounded-lg"
            >
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
                />
              </svg>

              <p className="mb-2 text-2xl text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>

              <p className="text-l text-gray-500 dark:text-gray-400">
                Any file up to 10 MB
              </p>
            </label>

            <input
              id="dropzone-file"
              type="file"
              className=""
              onChange={handleFileChange}
              multiple={true}
            />

            <label
              htmlFor="drop-digital-signature"
              className="flex flex-col items-center justify-center pt-5 pb-6 px-10 dark:hover:bg-gray-600 rounded-lg"
            >
              Digital Signature
            </label>
            <input
              id="drop-digital-signature"
              type="file"
              className=""
              onChange={handleDigitalSignatureChange}
              multiple={true}
            />

            <button
              id="btnSend"
              className="flex items-center justify-center border-2 my-4 px-2 py-1 rounded hover:bg-gray-600"
              onClick={(event) => {
                event.preventDefault();
                sendFile(file!, 1, digitalSignature).catch((error) => {
                  console.error("Error sending file:", error);
                });
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
          </div> */}
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
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                {filePreview ? (
                  <>
                    {filePreview.type.includes("image") ? (
                      <div className="flex flex-col items-center justify-center w-full h-full">
                        <img
                          src={filePreview.arrayBuffer as string}
                          alt="file preview"
                          className="object-contain p-10"
                        />
                        <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">
                          <span className="font-semibold">
                            {filePreview.name}
                          </span>
                        </p>
                      </div>
                    ) : (
                      // show file icon with file name
                      <div className="flex flex-col items-center justify-center w-full h-full">
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
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
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
                {/* <div>
                {filePreview && (
                  <img
                    src={filePreview as string}
                    alt="preview"
                    className="w-fit-content h-32"
                  />
                )}
              </div> */}
              </label>

              {/* dropdown */}
            </div>
            {/* divider */}
            <div className="flex w-1/2 justify-between flex-col">
              <h3
                className="text-lg font-medium text-gray-900 dark:text-gray-100 text-center
                        flex flex-col items-center flex-center justify-center mb-4"
              >
                Digital Signature
              </h3>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file-digital-signature"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                  {digitalSignaturePreview ? (
                    <>
                      {digitalSignaturePreview.type.includes("image") ? (
                        <>
                          <img
                            src={digitalSignaturePreview.arrayBuffer as string}
                            alt="file preview"
                            className="w-full h-full object-contain p-10"
                          />
                          <p className="mb-2 text-lg text-gray-500 dark:text-gray-400 mt-4">
                            <span className="font-semibold">
                              {digitalSignaturePreview.name}
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
                              {digitalSignaturePreview.name}
                            </span>
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
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
          <div className="flex flex-col items-center justify-center w-full mt-2">
            <button
              id="btnSend"
              className="flex items-center justify-center border-2 my-4 px-2 py-1 rounded hover:bg-gray-600"
              onClick={(event) => {
                event.preventDefault();
                sendFile(file!, 1, digitalSignature).catch((error) => {
                  console.error("Error sending file:", error);
                });
                //clear file input
                setFile(undefined);
                setFilePreview(undefined);
                setDigitalSignature(undefined);
                setDigitalSignaturePreview(undefined);
                // close modal
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
