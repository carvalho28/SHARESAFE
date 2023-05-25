import Sidebar from "../components/sidebar";
import { useState, useEffect } from "react";
import receiveFile from "../encryption/ReceiveFile";
import { getCookie } from "../auth/Cookies";
import forge from "node-forge";

import decryptFile from "../encryption/DecryptFile";

type File = {
  id: number;
  file_name: string;
  file_type: string;
  file_size: number;
  algorithm: string;
  signatureV: string;
  created_at: string;
  user_id: number;
};

function FilePage() {
  // Get group id from url
  const currentPathname = window.location.pathname;
  const splitString = currentPathname.split("/");
  let id = splitString[splitString.length - 1];
  let group_id = +id;

  // Get user_id to query the db
  let user_id = getCookie("user_id");

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

    await fetch("http://localhost:3000/api/groups/getGroups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
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
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  useEffect(() => {
    if (groups.length > 0) {
      setSelectedGroup(groups.find((group) => group.id === group_id));
    }
  }, [groups]);
  const [heading, setHeading] = useState<string>("Not Found");
  useEffect(() => {
    if (selectedGroup) {
      setHeading(selectedGroup.name);
    }
  }, [selectedGroup]);

  const [dataFile, setdataFile] = useState<any>([]);
  const [groupData, setGroupData] = useState<any>({});
  const [privateKey, setPrivateKey] = useState<String>();

  const [validSignatures, setValidSignatures] = useState<any>([]);

  useEffect(() => {
    const getFiles = async () => {
      try {
        const receiveData = await receiveFile(group_id);
        console.log("receiveData", receiveData);
        setGroupData(receiveData);
        setdataFile(receiveData.group.files);
      } catch (error) {
        console.log(error);
      }
    };
    getFiles();
  }, []);

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
        const md = forge.md.sha256.create();
        // console.log("groupData.files[index]", groupData.files[index]);
        md.update(groupData.files[index]);
        console.log("md", md);
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
      await fetch("http://localhost:3000/api/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
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

  // TODO: DELETE THIS AFTER TESTING
  useEffect(() => {
    // console.log(privateKey);
  }, [privateKey]);

  function handleFileChange(e: any) {
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      const text = e.target.result;

      var lines = text.split("\n");
      lines.splice(0, 1);
      var newtext = lines.join("\n");

      setPrivateKey(newtext);
    };
    reader.readAsText(e.target.files[0]);
  }

  return (
    <div>
      <Sidebar />

      <div className="p-4 sm:ml-64">
        <input type="file" id="file" onChange={(e) => handleFileChange(e)} />
        <section>
          {/* Ficheiros */}
          <h2 className="text-center underline">{heading}</h2>
          <br></br>
          <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
            {/* CabeÃ§alho */}
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
              </tr>
            </thead>
            {/* Linhas da base de dados */}
            {dataFile && (
              <tbody>
                {dataFile.map((file: any, index: number) => (
                  <tr
                    key={file.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <th>{file.file_name}</th>
                    <td className="px-6 py-4">{file.file_size}</td>
                    <td className="px-6 py-4">{file.file_type}</td>
                    <td className="px-6 py-4">{getUserById(file.user_id)}</td>
                    <td className="px-6 py-4">
                      {validSignatures[index] ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          handleDownloadClick(
                            file,
                            groupData.files[index],
                            index,
                          )
                        }
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </section>
      </div>
    </div>
  );
}

export default FilePage;
