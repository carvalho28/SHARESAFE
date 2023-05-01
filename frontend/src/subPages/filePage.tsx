import Sidebar from "../components/sidebar";
import { useState } from "react";

type File = {
    name: string;
    size: number[];
    type: string;
    owner: string;
};

function FilePage() {

    // Group Name
    let heading = "Segurança Informática";

    const [file,setFile] = useState<File>({
        name: "",
        size: [1],
        type: "",
        owner: "",
    });

  return (
    <div>
      <Sidebar />

      <div className="p-4 sm:ml-64">
        <p>INBOX</p>
        <section>
          {/* Ficheiros */}
          <h2 className="text-center underline">{heading}</h2>
          <br></br>
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            {/* Cabeçalho */}
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
