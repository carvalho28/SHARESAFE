import React, { ChangeEvent, useState } from "react";
import sendFile from "../encryption/SendFile";

export default function SendFilePopup(props: { triggered:boolean, setTriggered: Function}) {
    const [file, setFile] = useState<File>();

    const handleFileChange = (e : ChangeEvent<HTMLInputElement>) => {
        if (e.target.files)
            setFile(e.target.files[0]);
    }

    return (props.triggered) ? (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex
                        justify-center items-center">
            <div className=" w-[600px] flex flex-col">
                <button onClick={() => props.setTriggered(false)} className="text-white text-xl place-self-end">X</button>
                <div className="bg-white p-2 rounded">
                    
                    <input type="file" name="file" onChange={handleFileChange}/> <br />
                    <button onClick={() => sendFile(file)}>Send</button>
                </div>
            </div>
        </div>
        
        ) : null;
}