import Sidebar from "../components/sidebar";
import { useEffect, useState } from "react";
import receiveFile from "../encryption/ReceiveFile";


// this pages only contains the files for the group "Global", common to every user
function InboxPage() {
  
  let heading = "Global"
  let group_id = 1;

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

  return (
    <div>
      <Sidebar />

      <div className="p-4 sm:ml-64">
        <section>
          {/* Ficheiros */}
          <h2 className="text-center underline">{heading}</h2>
          <br></br>
          <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
            {/* Cabecalho */}
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
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

export default InboxPage;