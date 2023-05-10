import Sidebar from "../components/sidebar";
import { useState , useEffect } from "react";

type File = {
    name: string;
    size: number[];
    type: string;
    owner: string;
};

function FilePage() {

    // Get group id
    const currentPathname = window.location.pathname;
    const splitString = currentPathname.split("/");
    //console.log(currentPathname);
    let id = splitString[splitString.length-1];
    let group_id = +id;
    //console.log(group_id);

    // Get user_id to query the db
    let user_id = 20;

    const [files, setFiles] = useState<{
      name: string;
      size: number[];
      type: string;
      owner: string;
    }[]>([]);
    const [groups, setGroups] = useState<{
      id: number;
      name: string;
      created_at: string;
    }[]>([]);

    async function getGroupsUser(){

      const body = {
        user_id
      }
  
      await fetch("http://localhost:3000/api/groups/getGroups", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((data) => {
          //console.log(data);
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
  
  
  return (
    <div>
      <Sidebar />

      <div className="p-4 sm:ml-64">
        <section>
          {/* Ficheiros */}
          <h2 className="text-center underline">{heading}</h2>
          <br></br>
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            {/* CabeÃ§alho */}
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                  <a href="#">File Name</a>
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
            </tr>
            </thead>
            {/* Linhas da base de dados */}
            <tbody>
              
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

export default FilePage;