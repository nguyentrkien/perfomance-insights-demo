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
import { useSelector } from "react-redux";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import AddKPI from "tab-views/AddKPI";
import KPIs_list from "./KPIs_list";

function KPIs () {
    
    return (
        <Switch>
            <Route
                path={`/admin/kpis/add`}
                render={()=>(<AddKPI></AddKPI>)}
            />
            <Route
                path={`/admin/kpis/list`}
                render={()=>(<KPIs_list></KPIs_list>)}
            />
            <Redirect from='*' to={`/admin/kpis/list`}></Redirect>
            
        </Switch>
    );
}

export default KPIs;
