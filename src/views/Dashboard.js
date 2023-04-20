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
import classNames from "classnames";
//components for tab-switch
import Alarm from "tab-views/Alarm";
import Overview from "tab-views/Overview";
import { NavLink, Redirect, Route, Switch } from "react-router-dom";
import { useHistory, useLocation } from "react-router-dom";
// reactstrap components

import { useDispatch, useSelector } from "react-redux";
import { getVar } from "../store";
import CreateDashboard from "tab-views/CreateDashboard";
import DashboardE from "tab-views/DashboardE";


function Dashboard({asset}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const dashboards = useSelector(state => state.auth.login.currentUser?.dashboards);
  const _id = useSelector(state => state.auth.login.currentUser?._id);

  const getRoutes = (dashboards) => {
    return dashboards?.map((prop, i) => {
        return (
          <Route
            path={`/admin/device/${prop.asset}/dashboard/` + prop.id}
            render = {()=> {
              switch(prop.type){
                case 'overview':
                  return (<Overview asset={prop.asset}></Overview>)
                case 'add':
                  return (<CreateDashboard asset={prop.asset} assetId={_id}></CreateDashboard>)
                case 'dashboard':
                  return (<DashboardE asset={prop.asset} id={prop.id} assetId={_id}></DashboardE>)
                    }
                  }
                }
            key={i}
                />
        );
    });
  };
  
  React.useEffect(()=>{
    dispatch(getVar());
    history.push(`/admin/device/${asset}/dashboard/overview`);
  },[])

  return (
      <div className="content">
        <Switch>
          {getRoutes(dashboards)}
          <Redirect from="*" to={`/admin/device/${asset}/dashboard/overview`}></Redirect>
        </Switch>
      </div>
  );
}
export default Dashboard;