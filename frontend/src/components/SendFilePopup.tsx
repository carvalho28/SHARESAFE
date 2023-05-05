import React, { ChangeEvent, useState } from "react";
import sendFile from "../encryption/SendFile";

export default function SendFilePopup(props: {
  triggered: boolean;
  setTriggered: Function;
}) {
  const [file, setFile] = useState<File>();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    
    if (e.target.files) setFile(e.target.files[0]);
  };

  return props.triggered ? (
    <div className="fixed inset-0 p-4 sm:ml-64 bg-black bg-opacity-5 backdrop-blur-sm flex justify-center items-center">

      <div className="h-creen flex items-center justify-center">

        <form className="flex items-center justify-center">

          <div className="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700  dark:border-gray-600 ">

          <button onClick={() => props.setTriggered(false)} className="text-white place-self-end">

            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="25 "
              height="25" 
              fill="currentColor" 
              className="bi bi-x-circle" 
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>

          </button>
            
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center pt-5 pb-6 px-10 dark:hover:bg-gray-600 rounded-lg">

              <svg 
                aria-hidden="true" 
                className="w-10 h-10 mb-3 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>

              <p className="mb-2 text-2xl text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>

              <p className="text-l text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
            
            </label>

            <input id="dropzone-file" type="file" className="" onChange={handleFileChange} multiple={true}/>

            <button id="btnSend" className="flex items-center justify-center border-2 my-4 px-2 py-1 rounded hover:bg-gray-600" onClick={() => sendFile(file!)}>

              <p className="text-xl text-gray-500 dark:text-gray-300">Send <span className="font-semibold">File</span></p>
              
              <div className="pl-2">
              
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="22" 
                  height="22" 
                  fill="currentColor" 
                  className="bi bi-send text-gray-300" 
                  viewBox="0 0 16 16"
                > 
                  <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/>
                </svg>

              </div>

            </button>
          
          </div>

        </form>

      </div>
    </div>
  ) : null;
}
