import Sidebar from "../components/sidebar";
import { useState, useEffect } from "react";
import receiveFile from "../encryption/ReceiveFile";
import { getCookie } from "../auth/Cookies";
import forge from "node-forge";
import { GiThink } from "react-icons/gi";

import decryptFile from "../encryption/DecryptFile";
import { FaTimes } from "react-icons/fa";
import { Spinner } from "../components/Spinner";
import DownloadFilePopup from "../components/DownloadFilePopup";
import { api_url } from "../auth/general";

type File = {
  id: number;
  file_name: string;
  file_type: string;
  file_size: number;
  algorithm: string;
  signature: string;
  signature_algorithm: string;
  created_at: string;
  user_id: number;
};

function useMDForAlgorithm(algorithm: string) {
  let md = null;
  switch (algorithm) {
    case "SHA1":
      md = forge.md.sha1.create();
      break;
    case "SHA256":
      md = forge.md.sha256.create();
      break;
    case "SHA384":
      md = forge.md.sha384.create();
      break;
    case "SHA512":
      md = forge.md.sha512.create();
      break;
    case "MD5":
      md = forge.md.md5.create();
      break;
    default:
      md = forge.md.sha256.create();
      break;
  }
  return md;
}

function FilePage() {
  // Get group id from url
  const currentPathname = window.location.pathname;
  const splitString = currentPathname.split("/");
  const id = splitString[splitString.length - 1];
  const group_id = +id;

  // Get user_id to query the db
  const user_id = getCookie("user_id");

  const [loading, setLoading] = useState<boolean>(true);

  const [groups, setGroups] = useState<
    {
      id: number;
      name: string;
      created_at: string;
      files: File;
    }[]
  >([]);

  async function getGroupsUser() {
    const body = {
      user_id,
    };

    await fetch(api_url + "/groups/getGroups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + getCookie("accessToken"),
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        setGroups(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  // Call getGroupsUser function when component is mounted
  useEffect(() => {
    getGroupsUser();
  }, [user_id]);

  // Group Name
  const selectedGroup = groups.find((group) => group.id === group_id);
  const heading = selectedGroup ? selectedGroup.name : "Not Found";

  const [dataFile, setdataFile] = useState<any>([]);
  const [groupData, setGroupData] = useState<any>({});
  const [privateKey, setPrivateKey] = useState<String>();

  const [validSignatures, setValidSignatures] = useState<any>([]);
  const [algoSignature, setAlgoSignature] = useState<any>([]);

  useEffect(() => {
    const getFiles = async () => {
      try {
        const receiveData = await receiveFile(group_id);
        setGroupData(receiveData);
        setdataFile(receiveData.group.files);
        setAlgoSignature(
          receiveData.group.files.map((file: any) => {
            return file.signature_algorithm;
          }),
        );
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getFiles();
  }, []);

  useEffect(() => {}, [algoSignature]);

  useEffect(() => {
    if (dataFile.length === 0) {
      return;
    }
    setValidSignatures(
      groupData.group.files.map((file: any, index: number) => {
        // console.log("file", file);
        const publicKey = forge.pki.publicKeyFromPem(file.user.public_key);
        // console.log("publicKey", publicKey);
        const signature = forge.util.decode64(file.signature);
        // console.log("signature", signature);
        if (!signature) {
          return false;
        }
        // const md = forge.md.sha256.create();
        // get the md algorithm from the file
        const md = useMDForAlgorithm(algoSignature[index]);
        md.update(groupData.files[index]);
        const verified = publicKey.verify(md.digest().bytes(), signature);
        return verified;
      }),
    );
  }, [dataFile]);

  useEffect(() => {
    // console.log("dataFile", dataFile);
  }, [dataFile]);

  const [user, setUser] = useState<
    {
      id: number;
      name: string;
      email: string;
      password: string;
      public_key: string;
      salt: string;
    }[]
  >([]);

  // Owner user_name
  useEffect(() => {
    const getUser = async () => {
      await fetch(api_url + "/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + getCookie("accessToken"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
        })
        .catch((err) => {
          console.log(err.message);
        });
    };
    getUser();
  }, []);

  useEffect(() => {
    // console.log("user", user);
  }, [user]);

  function getUserById(id: number) {
    if (!dataFile) return;
    // console.log("Owner", id);
    const userWithID: any = user.find((user: any) => user.id === id);
    return userWithID.name;
  }

  const handleDownloadClick = async (
    fileInfo: any,
    encryptedFile: any,
    index: number,
  ) => {
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
    } catch (error) {
      console.log(error);
    }
  };

  const [triggered, setTriggered] = useState(false);
  const [ownerFile, setOwnerFile] = useState("");
  const [signedFile, setSignedFile] = useState("");
  const [file, setFile] = useState();
  const [fileData, setFileData] = useState(undefined);

  const deleteFile = async (file_id: number) => {
    // show alert
    const confirm = window.confirm(
      "Are you sure you want to delete this file?",
    );
    if (!confirm) {
      return;
    }
    console.log("file_id", file_id);
    console.log("body", JSON.stringify({ id: file_id }));
    try {
      await fetch(api_url + "/files/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: "Bearer " + getCookie("accessToken"),
        },
        body: JSON.stringify({ id: file_id }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          // reload page
          window.location.reload();
        })
        .catch((err) => {
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Sidebar />
      <DownloadFilePopup
        triggered={triggered}
        setTriggered={setTriggered}
        files={file}
        setFile={setFile}
        fileData={fileData}
        setFileData={setFileData}
        ownerFile={ownerFile}
        signedFile={signedFile}
      />
      <div className="p-4 sm:ml-64">
        <section>
          {/* Ficheiros */}
          <h2 className="text-center underline">{heading}</h2>
          <br></br>
          <table className="w-full text-sm text-center text-gray-100">
            {/* CabeÃ§alho */}
            <thead className="text-xs uppercase text-gray-100 bg-[#0B2447] dark:bg-[#242424]">
              <tr>
                <th scope="col" className="px-6 py-3">
                  File Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Size
                </th>
                <th scope="col" className="px-6 py-3">
                  Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Owner
                </th>
                <th scope="col" className="px-6 py-3">
                  Signed
                </th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            {/* Linhas da base de dados */}
            {dataFile.length !== 0 && loading === false && (
              <tbody>
                {dataFile.map((file: any, index: number) => (
                  <tr
                    key={file.id}
                    className="bg-[#19376D] dark:bg-[#333333] cursor:pointer border-b"
                  >
                    <th>{file.file_name}</th>
                    <td className="px-6 py-4">{file.file_size}</td>
                    <td className="px-6 py-4">{file.file_type}</td>
                    <td className="px-6 py-4">{getUserById(file.user_id)}</td>
                    <td className="px-6 py-4">
                      {validSignatures[index] ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4 hover:cursor-pointer">
                      <button
                        onClick={() => {
                          setTriggered(true);
                          setFile(file);
                          setFileData(groupData.files[index]);
                          setOwnerFile(getUserById(file.user_id));
                          setSignedFile(validSignatures[index] ? "Yes" : "No");
                        }}
                      >
                        Download
                      </button>
                    </td>
                    {file.user_id == user_id && (
                      <td className="px-6 py-4 hover:text-red-500 dark:hover:text-red-400">
                        <button
                          className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500"
                          onClick={() => {
                            deleteFile(file.id);
                          }}
                        >
                          <FaTimes />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          {loading && (
            <div className="text-center justify-center items-center w-full mt-10">
              <Spinner width="100" height="100" />
            </div>
          )}
          {/* if empty show No files yet */}
          {dataFile.length === 0 && loading === false && (
            <div className="flex justify-center items-center mt-10 flex-col">
              <p className="text-gray-400 text-4xl">No files yet</p>
              <GiThink className="ml-2 text-gray-400 mt-10" size={300} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default FilePage;
