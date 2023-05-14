import decryptFile from "./DecryptFile";

const endpoint = "http://localhost:3000/api/";

// Returns all the files of a specific group
async function downloadFile(group_id: number) {

  const body = {
    id: group_id,
  };

  return fetch(endpoint + "files/receive", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data) console.error("--> null data handler here");
      console.log(data.files);
      return data.files.data;
    })
    .catch((err) => {
      console.error(err.message);
      throw err;
    });
}

export default downloadFile;
