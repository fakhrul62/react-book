import React, { useContext } from 'react';
import PropTypes from "prop-types";
import { AuthContext } from '../components/providers/AuthProviders';
import { Navigate } from 'react-router-dom';
const PrivateRoute = ({children}) => {
    const {user, loading} = useContext(AuthContext);
    if(loading){
        return <span className="loading loading-dots loading-lg"></span>;
    }
    if (user) {
      return children;
    }
    return (
        <Navigate to="/login"></Navigate>
    );
};
PrivateRoute.propTypes = {
  children: PropTypes.any,
};
export default PrivateRoute;