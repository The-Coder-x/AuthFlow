import "./NotFound.scss";
import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="notfound-page">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for could not be found.</p>
      <Link className="back-btn" to="/">
        Go back to Home
      </Link>
    </div>
  );
}
