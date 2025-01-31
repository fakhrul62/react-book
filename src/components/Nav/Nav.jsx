import {
  Avatar,
  Dropdown,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarCollapse,
  NavbarToggle,
} from "flowbite-react";
import { Link, NavLink } from "react-router-dom";
import "./Nav.css";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProviders";

const Nav = () => {
  const { user, logOut } = useContext(AuthContext);
  const li = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/listed-books">Listed Books</NavLink>
      </li>
      <li>
        <NavLink to="/statistics">Statistics</NavLink>
      </li>
    </>
  );
   const handleLogOut = () => {
     logOut()
       .then(() => {
         console.log("user logged out");
       })
       .catch((error) => {
         const errorCode = error.message;
         console.log(errorCode);
       });
   };

  return (
    <div>
      <Navbar fluid rounded className="w-10/12 mx-auto !px-0 mt-2">
        <NavLink to="/" className="flex items-center">
          <img
            src="/react.svg"
            className="mr-3 h-6 sm:h-9"
            alt="Flowbite React Logo"
          />
          <h1 className="self-center whitespace-nowrap text-xl font-bold dark:text-white">
            React Book
          </h1>
        </NavLink>
        <div className="flex md:order-2">
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                className="nav-img"
                img={
                  user?.photoURL !== ""
                    ? user?.photoURL
                    : "../../assets/user-avatar.png"
                }
                rounded object-cover
              />
            }
          >
            <DropdownHeader>
              <span className="block text-sm">{user?.displayName}</span>
              <span className="block truncate text-sm font-medium">
                {user?.email}
              </span>
            </DropdownHeader>
            {user ? (
              <DropdownItem>
                <Link>
                  <button onClick={handleLogOut} className="" type="button">
                    Logout
                  </button>
                </Link>
              </DropdownItem>
            ) : (
              <div>
                <DropdownItem>
                  <Link to="/login">Login</Link>
                </DropdownItem>
                <DropdownItem>
                  <Link to="/register">Register</Link>
                </DropdownItem>
              </div>
            )}
          </Dropdown>
          <NavbarToggle />
        </div>
        <NavbarCollapse>{li}</NavbarCollapse>
      </Navbar>
    </div>
  );
};

export default Nav;
