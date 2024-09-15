import React from "react";
import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import { NavLink } from "react-router-dom";
import "./Nav.css"

const Nav = () => {
  const li = <>
  <li><NavLink to="/">Home</NavLink></li>
  <li><NavLink to="/listed-books">Listed Books</NavLink></li>
  <li><NavLink to="/statistics">Statistics</NavLink></li>
  </>
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
                img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                rounded
              />
            }
          >
            <DropdownHeader>
              <span className="block text-sm">Bonnie Green</span>
              <span className="block truncate text-sm font-medium">
                name@flowbite.com
              </span>
            </DropdownHeader>
            <DropdownItem>Dashboard</DropdownItem>
            <DropdownItem>Settings</DropdownItem>
            <DropdownItem>Earnings</DropdownItem>
            <DropdownDivider />
            <DropdownItem>Sign out</DropdownItem>
          </Dropdown>
          <NavbarToggle />
        </div>
        <NavbarCollapse>
          {li}
        </NavbarCollapse>
      </Navbar>
    </div>
  );
};

export default Nav;
