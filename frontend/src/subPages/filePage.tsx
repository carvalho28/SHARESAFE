import Sidebar from "../components/sidebar";
import { useState, useEffect } from "react";
import receiveFile from "../encryption/ReceiveFile";
import downloadFile from "../encryption/DownloadFile";
import { getCookie } from "../auth/Cookies";

type File = {
  id: number;
  file_name: string;
  file_type: string;
  file_size: number;
  algorithm: string;
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
  let user_id = getCookie('user_id');

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
  }, []);

  // Group Name
  let selectedGroup = groups.find((group) => group.id === group_id);
  let heading = selectedGroup ? selectedGroup.name : "Not Found";

  const [dataFile, setdataFile] = useState<any>([]);

  useEffect(() => {
    const getFiles = async () => {
      try {
        const receiveData = await receiveFile(group_id);
        console.log("receiveData", receiveData);
        setdataFile(receiveData);
      } catch (error) {
        console.log(error);
      }
    };
    getFiles();
  }, []);

  useEffect(() => {
    console.log("dataFile", dataFile);
  }, [dataFile]);

  const [user,setUser] = useState<
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
              console.log("users", data);
              setUser(data);
            })
            .catch((err) => {
              console.log(err.message);
            });
    
        }; 
        getUser();
}, []);

  useEffect(() => {
    console.log("user", user);
  }, [user]);

  function getUserById(id : number){
    console.log("Owner", id);
    const userWithID : any = user.find((user: any) => user.id === id);
    return userWithID.name;
  }

  //const [dFile, setdFile] = useState<any>([]);

  const handleDownloadClick = async (name : string) => {
    try {
        const receiveData = await downloadFile(group_id);
        const element = document.createElement("a");
        const file = new Blob([receiveData], {
            type: "text/plain",
        });
        element.href = URL.createObjectURL(file);
        element.download = name;
        document.body.appendChild(element);
        element.click();
        element.remove();
    } catch (error) {
        console.log(error); 
    }
  }

  return (
    <div>
      <Sidebar />

      <div className="p-4 sm:ml-64">
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
                <th></th>
              </tr>
            </thead>
            {/* Linhas da base de dados */}
            <tbody>
              {dataFile.map((file: any) => (
                <tr
                  key={file.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th>{file.file_name}</th>
                  <td className="px-6 py-4">{file.file_size}</td>
                  <td className="px-6 py-4">{file.file_type}</td>
                  <td className="px-6 py-4">{getUserById(file.user_id)}</td>
                  <td className="px-6 py-4"><button onClick={() => handleDownloadClick(file.file_name)}>Download</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

export default FilePage;
