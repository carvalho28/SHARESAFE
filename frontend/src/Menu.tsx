import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyLogin } from "./auth/Cookies";
import Sidebar from "./components/sidebar";

function MainMenu() {
  const navigate = useNavigate();

  useEffect(() => {
    verifyLogin(navigate);
  }, []);

  return (
    <div>
      <Sidebar />
    </div>
  );
}

export default MainMenu;
