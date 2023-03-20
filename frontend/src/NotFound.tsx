import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div>
      <h1>Not Found</h1>
      <p>Sorry, the page you were looking for was not found.</p>
      <Link to="/">Go to Home</Link>
    </div>
  );
}

export default NotFound;
