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
  const user_id = +getCookie("user_id");

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
    document.body.style.cursor = "pointer";
  };

  const handleMouseOut = () => {
    document.body.style.cursor = "default";
  };

  /**
   *
   * Create Group
   *
   */

  // Users to get permited emails
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
          setErrorMessage("Unable to create group!");
        });
    };
    getUser();
  }, []);

  const [isShowingCreateForm, setIsShowingCreateForm] = useState(false);

  const handleCreateForm = () => {
    setIsShowingCreateForm(!isShowingCreateForm);
    isShowingEditForm
      ? setIsShowingEditForm(!isShowingEditForm)
      : setIsShowingEditForm(isShowingEditForm);
  };

  useEffect(() => {
    console.log("emails", validEmails);
  }, [validEmails]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [groupIdEdit, setGroupIdEdit] = useState<number>();

  const [errorMessage, setErrorMessage] = useState("");

  const [showErrorMessage, setShowErrorMessage] = useState(false);

  function getEmailById(id: number) {
    console.log("Owner", id);
    const userWithID: any = user.find((user: any) => user.id === id);
    return userWithID.email;
  }

  const handleAddNewMember = async () => {
    if (email.trim() !== "") {
      if (validEmails.includes(email)) {
        const selectedUser = user.filter((item) => item.email === email);
        console.log(selectedUser);

        const response = await fetch(
          "http://localhost:3000/api/groups/addMemberToGroup",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              group_id: groupIdEdit,
              user_id: selectedUser[0].id,
            }),
          },
        )
          .then((res) => res.json())
          .then((data) => {
            return data;
          })
          .catch((err) => {
            console.log(err.message);
          });

        console.log(response);

        if (response) {
          console.log("user added");
        } else {
          setErrorMessage("Error adding user");
          setShowErrorMessage(true);
        }
      }
    }
  };

  const handleAddMember = () => {
    if (email.trim() !== "") {
      setShowErrorMessage(false);
      // email exists?
      if (validEmails.includes(email)) {
        setShowErrorMessage(false);
        // duplicated email?
        if (!members.includes(email)) {
          setShowErrorMessage(false);
          setMembers((prevMembers) => [...prevMembers, email]);
        } else {
          // email duplicated
          setShowErrorMessage(true);
          setErrorMessage("Email duplicated!");
        }
      } else {
        // invalid email
        setShowErrorMessage(true);
        setErrorMessage("That email does not exist for this service!");
      }
      setEmail("");
    } else {
      // empty field
      setShowErrorMessage(true);
      setErrorMessage("Empty Field!");
    }
  };

  useEffect(() => {
    console.log("useEffect members", members);
  }, [members]);

  const handleLeaveGroup = async () => {
    if (user_id && groupIdEdit) {
      await fetch("http://localhost:3000/api/groups/removeUserFromGroup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
          group_id: groupIdEdit,
          user_id: user_id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          if (data.status === "success") {
            setGroups(groups.filter((group) => group.id !== groupIdEdit));
            setIsShowingEditForm(false);
          } else {
            console.error(data.message);
          }
        })
        .catch((err) => {
          console.log(err.message);
          setErrorMessage("Unable to leave group!");
        });
    }
  };

  const handleCreateGroup = async () => {
    if (name == "") {
      setShowErrorMessage(true);
      setErrorMessage("Group name required!");
      return;
    }
    if (members.length == 0) {
      setShowErrorMessage(true);
      setErrorMessage("Missing members!");
      return;
    }

    const emailOwner = getEmailById(user_id);

    // if (!members.includes(emailOwner)) {
    //   setMembers((prevMembers) => [...prevMembers, emailOwner]);
    // }

    let body: any = {};
    if (!members.includes(emailOwner)) {
      const newMembers = [...members, emailOwner];
      body = {
        name,
        members: newMembers,
      };
    } else {
      body = {
        name,
        members,
      };
    }

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
    // refresh groups
    getGroupsUser();
    // delete fields
    setName("");
    setEmail("");
    setMembers([]);
    setShowErrorMessage(false);
    // close form
    setIsShowingCreateForm(false);
  };

  /**
   *
   *
   * Edit group
   *
   */

  const [isShowingEditForm, setIsShowingEditForm] = useState(false);

  const handleEditForm = (id: number) => {
    setGroupIdEdit(id);
    if (!(id === 1)) {
      setIsShowingEditForm(!isShowingEditForm);
      isShowingCreateForm
        ? setIsShowingCreateForm(!isShowingCreateForm)
        : setIsShowingCreateForm(isShowingCreateForm);
    }
  };

  const handleRemoveMember = async (email: string) => {
    // remove member from group
    console.log(email);
  };

  return (
    <div>
      <Sidebar />

      <div className="p-4 sm:ml-64">
        {/* Grupos */}
        <h2 className="text-center underline">Groups</h2>
        <br></br>
        <table className="w-full text-sm text-center text-gray-100">
          {/* Cabecalho */}
          <thead className="text-xs uppercase text-gray-100 bg-[#0B2447] dark:bg-[#242424]">
            <tr>
              <th scope="col" className="px-6 py-3">
                Group
              </th>
              <th>Created At</th>
              <th></th>
            </tr>
          </thead>

          {/* Linhas da base de dados */}
          <tbody>
            {groups.map((group) => (
              <tr
                key={group.id}
                className="bg-[#19376D] dark:bg-[#333333] cursor:pointer border-b"
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
              >
                <th onClick={() => handleGroupClick(group)}>{group.name}</th>
                <td
                  className="px-6 py-4"
                  onClick={() => handleGroupClick(group)}
                >
                  {group.created_at.substring(0, 10)}
                </td>
                <td
                  className="underline"
                  onClick={() => handleEditForm(group.id)}
                >
                  {group.id === 1 ? "" : "Edit"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr className="border-[#e57b1e] dark:border-[#9c9c9c] border-2 rounded my-5" />

        {/** Buttons */}
        <div className="w-1/4 ml-5">
          <button
            className="shadow appearance-none border rounded w-1/2 py-2 bg-[#0B2447] hover:bg-[#19376D] dark:bg-[#333333] dark:hover:bg-[#383838] text-gray-100 font-bold text-xl"
            onClick={handleCreateForm}
          >
            New Group
          </button>
        </div>

        <hr className="border-[#e57b1e] dark:border-[#9c9c9c] border-2 rounded my-5" />

        <div className="flex items-center justify-center">
          {/** Create Group */}
          {isShowingCreateForm && (
            <form className="w-1/2 text-center pt-5">
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

              <div className="pt-1 pb-5 flex justify-center">
                <button
                  type="button"
                  className="bg-[#0B2447] hover:bg-[#19376D] text-white dark:text-[#d9d9d9] dark:bg-[#333333] dark:hover:bg-[#383838] focus:ring-2 focus:ring-[#E57B1E] font-medium rounded-lg text-sm px-5 py-2 mr-2 mb-2 focus:outline-none dark:focus:ring-[#383838]"
                  onClick={handleAddMember}
                >
                  Add Member
                </button>
              </div>

              <div className="flex justify-center pb-5">
                <table className="w-1/2 text-sm text-center text-gray-100">
                  <thead className="text-xs text-gray-100 uppercase bg-[#0B2447] dark:bg-[#242424]">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Members
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {members.map((member, index) => (
                      <tr
                        key={index}
                        className="text-gray-100 bg-[#19376D] dark:bg-[#333333] cursor:pointer border-b"
                      >
                        <th>{member}</th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {showErrorMessage && (
                <div className="flex items-center justify-center">
                  <div
                    className="w-1/2 flex items-center justify-center mb-2 p-1 text-center text-l text-red-800 border border-red-300 rounded-lg bg-red-5 dark:text-red-400 dark:border-red-800"
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
                </div>
              )}

              <div className="pt-1 pb-5 flex justify-center">
                <button
                  type="button"
                  className="bg-[#0B2447] hover:bg-[#19376D] text-white dark:text-[#d9d9d9] dark:bg-[#333333] dark:hover:bg-[#383838] focus:ring-2 focus:ring-[#E57B1E] font-medium rounded-lg text-sm px-5 py-2 mr-2 mb-2 focus:outline-none dark:focus:ring-[#383838]"
                  onClick={handleCreateGroup}
                >
                  Create Group
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="flex items-center justify-center">
          {/** Edit Group */}
          {isShowingEditForm && (
            <form className="w-1/2 text-center pt-5">
              <h1>Edit Group</h1>

              <div className="flex justify-center py-5">
                <table className="w-1/2 text-sm text-center text-gray-100">
                  <thead className="text-xs text-gray-100 uppercase bg-[#0B2447] dark:bg-[#242424]">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Members
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {members.map((member, index) => (
                      <tr
                        key={index}
                        className="text-gray-100 bg-[#19376D] dark:bg-[#333333] cursor:pointer border-b"
                        onClick={() => handleRemoveMember(member)}
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                      >
                        <th>{member}</th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="py-3 flex justify-center">
                <input
                  className="shadow appearance-none w-1/2 border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xl"
                  id="email"
                  type="email"
                  placeholder="Enter new member email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>

              {showErrorMessage && (
                <div className="flex items-center justify-center">
                  <div
                    className="w-1/2 flex items-center justify-center mb-2 p-1 text-center text-l text-red-800 border border-red-300 rounded-lg bg-red-5 dark:text-red-400 dark:border-red-800"
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
                </div>
              )}

              <div className="pt-1 pb-5 flex justify-center">
                <button
                  type="button"
                  className="bg-[#0B2447] hover:bg-[#19376D] text-white dark:text-[#d9d9d9] dark:bg-[#333333] dark:hover:bg-[#383838] focus:ring-2 focus:ring-[#E57B1E] font-medium rounded-lg text-sm px-5 py-2 mr-2 mb-2 focus:outline-none dark:focus:ring-[#383838]"
                  onClick={handleAddNewMember}
                >
                  Add Member
                </button>
              </div>

              <div className="pt-1 pb-5 flex justify-center">
                <button
                  type="button"
                  className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-300"
                  onClick={handleLeaveGroup}
                >
                  Leave Group
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default GroupPage;
