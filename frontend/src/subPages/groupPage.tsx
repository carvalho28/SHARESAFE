import Sidebar from "../components/sidebar";
import { useEffect, useState } from "react";
import { getCookie } from "../auth/Cookies";

type Group = {
  id: number;
  name: string;
  created_at: string;
  //files: number;
  //members: number;
};

function GroupPage() {
  const [groups, setGroups] = useState<
    {
      id: number;
      name: string;
      created_at: string;
    }[]
  >([]);

  // Get user_id to query the db
  const user_id = getCookie('user_id');

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

  // construct url and navigate to the group url
  const handleGroupClick = (group: Group) => {
    const encodedGroupId = encodeURIComponent(group.id.toString());
    const currentPathname = window.location.pathname;
    const url = `${currentPathname}/group/${encodedGroupId}`;
    console.log(url);
    window.location.href = url;
  };

  // Mouse cursor css
  const handleMouseOver = () => {
    document.body.style.cursor = 'pointer';
  };

  const handleMouseOut = () => {
    document.body.style.cursor = 'default';
  };

  const [isCreateFormVisible, setIsCreateFormVisible] = useState(false);

  const handleToggleCreateForm = () => {
    setIsCreateFormVisible((prevValue) => !prevValue);
  };

  const [isEditFormVisible, setIsEditFormVisible] = useState(false);

  const handleToogleEditForm = () => {
    setIsEditFormVisible((prevValue) => !prevValue);
  }

  const [email, setEmail] = useState<string>('');
  const [members, setMembers] = useState<string[]>([]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleAddMember = () => {
    if (email.trim() !== '') {
      if (!members.includes(email)) {
        setMembers((prevMembers) => [...prevMembers, email]);
      }
      setEmail('');
    }
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggleDropdown = () => {
    setIsDropdownOpen((prevValue) => !prevValue);
  };

  const [name, setName] = useState("");

  const handleSelectMember = (name: string) => {
    setName(name);
    setIsDropdownOpen(false);
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
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 cursor:pointer"
                  onClick={() => handleGroupClick(group)}
                  onMouseOver={handleMouseOver}
                  onMouseOut={handleMouseOut}
                >
                  <th>
                      {group.name}
                  </th>
                {/*<td className="px-6 py-4">
                  {group.members}
                </td>
                <td className="px-6 py-4">
                  {group.files}
                </td>*/}
                  <td className="px-6 py-4">{group.created_at.substring(0,10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="w-full flex justify-center relative isolate overflow-hidden">

          <div className="w-1/2 bg-orange-100 text-center py-5">

            <button
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              onClick={handleToggleCreateForm}
            >
              Create Group
            </button>
            
          
            {isCreateFormVisible && (
              <div className="py-10">
                <div className="py-3 px-20">
                  <input
                    className="shadow appearance-none w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xl"
                    placeholder="Enter group name"
                  />
                </div>
                
                <div className="py-3 px-20 space-y-3">
                  <br></br>
                  <h1 className="text-left">Add some members!</h1>
                  <input
                    className="shadow appearance-none w-full border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xl"
                    id="email"
                    type="email"
                    placeholder="Enter member email"
                    value={email}
                    onChange={handleEmailChange}
                  />
                  <button
                    className="flex justify-start text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    onClick={handleAddMember}
                  >
                    Add
                  </button>
                </div>  

                <div className="py-3 px-20">

                  <table className="w-full text-sm text-center text-gray-100">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Members
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((member, index) => (
                        <tr key={index} className="bg-gray-100 cursor:pointer">
                          <td>{member}</td>
                        </tr>
                        
                      ))}
                    </tbody>
                  </table>
                </div>
                
              </div>
            )}

          </div>
          <div className="w-1/2 bg-red-100 text-center py-5">
            <button
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              onClick={handleToogleEditForm}
            >
              Edit group
            </button>

            {isEditFormVisible && (
              <div className="py-10">
                <div>
                  <button onClick={handleToggleDropdown}>
                    {isDropdownOpen ? 'Close Dropdown' : 'Open Dropdown'}
                  </button>
                  {isDropdownOpen && (
                    <ul>
                      {groups.map((group, index) => (
                        <li key={index} onClick={() => handleSelectMember(group.name)}>
                          {group.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

              </div>
            )}

          </div>

          
  
        </section>
      </div>
    </div>
  );
}

export default GroupPage;