import Sidebar from "../components/sidebar";
import { useEffect, useState } from "react";

type Group = {
  id: number;
  name: string;
  created_at: string;
  //files: number;
  //members: number;
};

function InboxPage() {
  const [groups, setGroups] = useState<
    {
      id: number;
      name: string;
      created_at: string;
    }[]
  >([]);

  // Get user_id to query the db
  let user_id = 20;

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
        console.log(data);
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

  const handleGroupClick = (group: Group) => {
    const encodedGroupId = encodeURIComponent(group.id.toString());
    const currentPathname = window.location.pathname;
    const url = `${currentPathname}/group/${encodedGroupId}`;
    console.log(url);
    window.location.href = url;
  };

  return (
    <div>
      <Sidebar />

      <div className="p-4 sm:ml-64">
        <section>
          {/* Grupos */}
          <h2 className="text-center underline">Groups</h2>
          <br></br>
          <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
            {/* CabeÃ§alho */}
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Group
                </th>
                {/*<th scope="col" className="px-6 py-3">
                  Members
                </th>
                <th scope="col" className="px-6 py-3">
                  Files
                </th>*/}
                <th>Created At</th>
              </tr>
            </thead>

            {/* Linhas da base de dados */}
            <tbody>
              {groups.map((group) => (
                <tr
                  key={group.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th>
                    <button onClick={() => handleGroupClick(group)}>
                      {group.name}
                    </button>
                  </th>
                  {/*<td className="px-6 py-4">
                 {group.members}
                </td>
                <td className="px-6 py-4">
                  {group.files}
                </td>*/}
                  <td className="px-6 py-4">{group.created_at}</td>
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
