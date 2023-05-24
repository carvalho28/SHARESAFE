import { useState } from "react";
import Sidebar from "../components/sidebar";

type Group = {
  name: string;
  files: number[];
  members: string[];
};

function GroupPage() {
  // variables for group
  const [group, setGroup] = useState<Group>({
    name: "Random243",
    files: [],
    members: ["diogo@diogo.com", "fernando.cruz@ubi.pt"],
  });

  // create a new group with a post request
  const createGroup = async () => {
    const response = await fetch("http://localhost:3000/api/groups/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: group.name,
        // files: group.files,
        members: group.members,
      }),
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }
    const data = await response.json();
    console.log(data);
  };

  return (
    <div>
      <Sidebar />

      <div className="p-4 sm:ml-64">
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4
           focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 
           mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none
            dark:focus:ring-blue-800"
          onClick={createGroup}
        >
          New group
        </button>

        <p>GRUPO</p>
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
              <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
            </div>
            <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
              <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
            </div>
            <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
              <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
            </div>
          </div>
          <div className="flex items-center justify-center h-48 mb-4 rounded bg-gray-50 dark:bg-gray-800">
            <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
              <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
            </div>
            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
              <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
            </div>
            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
              <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
            </div>
            <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
              <p className="text-2xl text-gray-400 dark:text-gray-500">+</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupPage;
