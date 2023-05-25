import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import NotFound from "./NotFound";
import Register from "./Register";
import MainMenu from "./Menu";
import GroupPage from "./subPages/groupPage";
import HelpPage from "./subPages/helpPage";
import InboxPage from "./subPages/inboxPage";
import FilePage from "./subPages/filePage";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/mainmenu" element={<MainMenu />} />
      <Route path="/inbox" element={<InboxPage />} />
      <Route path="/group/group/:id" element={<FilePage />} />
      <Route path="/group" element={<GroupPage />} />
      {/* <Route path="/help" element={<HelpPage />} /> */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export function RenderApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
