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


  /**
   * 
   * Create Group
   * 
   */

  // Users to get permited emails
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

  const [validEmails, setValidEmails] = useState<string[]>([]);

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
              const emails = data.map((user: any) => user.email); 
              setValidEmails(emails);
            })
            .catch((err) => {
              console.log(err.message);
              setErrorMessage("Unable to create group!")
            });
    
        }; 
        getUser();
  }, []); 

  const [isShowingCreateForm, setIsShowingCreateForm] = useState(false);

  const handleCreateForm = () => {
    setIsShowingCreateForm(!isShowingCreateForm);
  }

  useEffect(() => {
    console.log("emails",validEmails);
  }, [validEmails]);


  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [members, setMembers] = useState<string[]>([]);
  const [errorMembersMessage, setErrorMembersMessage] = useState("");
  const [errorNameMessage, setErrorNameMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");


  const handleAddMember = () => {
    if (email.trim() !== '') {
      // email exists?
      if (validEmails.includes(email)) {
        // duplicated email?
        if (!members.includes(email)) {
          setMembers((prevMembers) => [...prevMembers, email]);
        }
        else {
          // email duplicated
          setErrorMembersMessage("Email duplicated!");
        }
      }
      else {
        // invalid email
        setErrorMembersMessage("That email does not exist for this service!");
      }
      setEmail('');
    }
    else {
      // empty field
      setErrorMembersMessage("Empty Field!");
    }
  };

  useEffect(() => {
    console.log("useEffect members", members);
  }, [members]);

  const handleCreateGroup = async () => {
    if(name == ""){
      setErrorNameMessage("Group name required!");
      return;
    }
    if (members.length == 0){
      setErrorMessage("Missing members!");
      return;
    }

    const body = {
      name,
      members,
    };

    const response = await fetch("http://localhost:3000/api/groups/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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
        
          {/* Grupos */}
          <h2 className="text-center underline">Groups</h2>
          <br></br>
          <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
            {/* Cabecalho */}
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
      </div>

      <div className="px-4 sm:ml-64">
          <hr
            style={{
            background: 'black',
            height: '3px',
            }}
          />
      </div>

      <div className="p-4 sm:ml-64">

            {/** Buttons */}
          <div className="w-full text-center flex">

            <div className="w-1/2 bg-orange-100">
              <button
                className="shadow appearance-none border rounded w-1/2 py-2 bg-blue-900 hover:bg-blue-600 text-white font-bold text-xl"
                onClick={handleCreateForm}
              >
                New Group
              </button>
            </div>

            <div className="w-1/2 bg-yellow-100">
              <p>Edit Group</p>
            </div>

          </div>

          {/** Create Group */}
          {isShowingCreateForm && (
            <form className="w-full bg-green-100 text-center pt-5">

              <h1>Create Group</h1>
              
              <div className="py-3 flex items-center justify-center">
                <input
                  className="shadow appearance-none w-1/2 border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xl"
                  id="name"
                  type="text"
                  placeholder="Enter group name"
                  required
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {errorNameMessage != "" && (
                <div
                  className="flex items-center justify-center mb-2 p-1 text-center text-l text-red-800 border border-red-300 rounded-lg bg-red-5 dark:text-red-400 dark:border-red-800"
                  role="alert"
                >
                  <svg
                    aria-hidden="true"
                    className="flex-shrink-0 inline w-5 h-5 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Info</span>
                  <div>
                    <span className="font-medium">{errorNameMessage}</span>
                  </div>
                </div>
              )}
            
              <div className="py-3 flex justify-center">
                <input
                  className="shadow appearance-none w-1/2 border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xl"
                  id="email"
                  type="email"
                  placeholder="Enter member email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>

              {errorMembersMessage != "" && (
                <div
                  className="flex items-center justify-center mb-2 p-1 text-center text-l text-red-800 border border-red-300 rounded-lg bg-red-5 dark:text-red-400 dark:border-red-800"
                  role="alert"
                >
                  <svg
                    aria-hidden="true"
                    className="flex-shrink-0 inline w-5 h-5 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Info</span>
                  <div>
                    <span className="font-medium">{errorMembersMessage}</span>
                  </div>
                </div>
              )}

              <div className="pt-1 pb-5 flex justify-center">
                <button
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  onClick={handleAddMember}
                >
                  Add member
                </button>
              </div>

              <div className="flex justify-center pb-5">
                <table className="w-1/2 text-sm text-center text-black">
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
                        <th>{member}</th>
                      </tr>
                    ))}
                      
                  </tbody>
                </table>
              </div>

              {errorMessage != "" && (
                <div
                  className="flex items-center justify-center mb-2 p-1 text-center text-l text-red-800 border border-red-300 rounded-lg bg-red-5 dark:text-red-400 dark:border-red-800"
                  role="alert"
                >
                  <svg
                    aria-hidden="true"
                    className="flex-shrink-0 inline w-5 h-5 mr-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="sr-only">Info</span>
                  <div>
                    <span className="font-medium">{errorMessage}</span>
                  </div>
                </div>
              )}

              <div className="pt-1 pb-5 flex justify-center">
                <button
                  type="button"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  onClick={handleCreateGroup}
                >
                  Create Group
                </button>
              </div>

            </form>
          )}
          



      </div>

    </div>
  );
}

export default GroupPage;