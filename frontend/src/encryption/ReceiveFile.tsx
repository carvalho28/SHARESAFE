import forge from "node-forge";

const endpoint = "http://localhost:3000/api/"

async function receiveFile(group_id: number) {

    const body = {
        id: group_id
    }

    await fetch(endpoint+"files/receive", {
        method: "GET",
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
            console.error(err.message);
        });

}

export default receiveFile;