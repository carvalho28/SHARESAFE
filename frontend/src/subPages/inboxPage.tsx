import Sidebar from "../components/sidebar";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

interface Props {
  groupId: string;
}

type Group = {
  id: number;
  name: string;
  members: { id: number }[];
  files: { id: number }[];
  createdAt: string;
};


function InboxPage() {

  const [groups, setGroups] = useState<Group[]>([]);

  let user_id = 3;

  async function getGroupsUser(){

    const body = {
      id: user_id
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
        console.log(data);
      })
      .catch((err) => {
        console.log(err.message);
      });

  }

  let id = 3;

  function encodeGroupID(){
    const encodedGroupId = encodeURIComponent(id);
  }
  
  
  return (
    <div>
      <Sidebar />

      <div className="p-4 sm:ml-64">
        <p>INBOX</p>
        <section>
          {/* Grupos */}
          <h2 className="text-center underline">Groups</h2>
          <br></br>
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            {/* Cabeçalho */}
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                  Group
                </th>
                <th scope="col" className="px-6 py-3">
                  Members
                </th>
                <th scope="col" className="px-6 py-3">
                  Files
                </th>
                <th>
                  Created At
                </th>
            </tr>
            </thead>

            {/* Linhas da base de dados */}
            <tbody>

            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {/*<Link onClick={encodeGroupID()} to={'/filePage/${encodedGroupId}'}>Apple MacBook Pro 17"</Link> */}
                </th>
                <td className="px-6 py-4">
                    Silver
                </td>
                <td className="px-6 py-4">
                    Laptop
                </td>
                <td className="px-6 py-4">
                    $2999
                </td>
            </tr>

            </tbody>

          </table>
        </section>
      </div>
    </div>
  );
}

export default InboxPage;
