/*!

=========================================================
* Black Dashboard React v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react plugin used to create charts
import { useState } from "react";
import { NavLink, useLocation, Route, Switch} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from "views/Dashboard.js";
import Icons from "views/Icons.js";
import { getAssets } from "store";
// reactstrap components
import {
  Nav
} from "reactstrap";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";


function Device(props) {
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [select, setSelect] = useState(null);
  const assets = useSelector((state)=> state.getAssets);
  const isGetAssets = useSelector((state)=> state.isGetAssets);
  const activeRoute = (routeName) => {
    return location.pathname === routeName ? "active" : "";
  };

  const getRoutes = (assets) => {
    return assets.map((prop, i) => {
        return (
          <Route
            path={'/admin/device/' + prop.name + '/dashboard'}
            render={()=><Dashboard asset={prop.name}></Dashboard>}
            // component={Dashboard}
            key={i}
            />
        );
    });
  };

  const handleSelect = (name, e) => {
    setSelect(name);
  }

  React.useEffect(()=>{
    dispatch(getAssets());
  },[])

  return (
    <>
    {isGetAssets?
      <div className="content">
      <div className="subSideBar">
        <Nav>
        {assets.map((prop, key) => {
                if (prop.redirect) return null;
                return (
                  <li
                    className={
                      activeRoute(prop.path) + `${select == prop.name? "select":""}`
                    }
                    key={key}
                    >
                    <NavLink
                      to={'/admin/device/' + prop.name + '/dashboard'}
                      className="nav-link"
                      activeClassName="active"
                      onClick={(e) => handleSelect(prop.name, e)}
                      >
                      {!prop.hasChildren?
                      <>
                        <i className='tim-icons icon-sound-wave' />
                        <p>{prop.name}</p>
                      </>
                      : <p>{prop.name}</p>
                      }
                    </NavLink>
                  </li>
                );
              })}
        </Nav>
      </div>
      <Switch>
        {getRoutes(assets)}
      </Switch>
    </div>
    : null}
    </>
  )
}

export default Device;
