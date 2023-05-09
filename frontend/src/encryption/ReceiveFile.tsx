import decryptFile from "./DecryptFile";

const endpoint = "http://localhost:3000/api/"

async function receiveFile(group_id: number) {

    const body = {
        id: group_id
    }

    await fetch(endpoint+"files/receive", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(body),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data) {
                console.log(data);
                
                // Just for testing, eliminate afeter !!!
                const input = {
                    algorithm: data.group.algorithm, 
                    iv: data.group.iv, 
                    encryptedKey: data.group.users_group.encrypted_key[0], 
                    encrypted_file: data.files[0]
                }
                // decryptFile(input);
                // end of teste

                return data;
            } else {
                console.error("--> null data handler");
            }
        })
        .catch((err) => {
            console.error(err.message);
        });

}

export default receiveFile;