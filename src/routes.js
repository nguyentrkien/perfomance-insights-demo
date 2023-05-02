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
import Device from "views/Device.js";
import Export from "views/Export.js"
import Notifications from "views/Notifications.js";
import DataStorage from "views/DataStorage.js";
import KPIs from "views/KPIs";

var routes = [
  {
    path: "/device",
    name: "Device",   
    icon: "tim-icons icon-chart-pie-36",
    component: Device,
    layout: "/admin"
  },
  {
    path: "/kpis",
    name: "KPIs",
    icon: "tim-icons icon-book-bookmark",
    component: KPIs,
    layout: "/admin"
  },
  {
    path: "/export",
    name: "Export",
    icon: "tim-icons icon-paper",
    component: Export,
    layout: "/admin"
  },
  {
    path: "/alert",
    name: "Alert History",
    icon: "tim-icons icon-bell-55",
    component: Notifications,
    layout: "/admin"
  },
  {
    path: "/dataService",
    name: "Data Storage",
    icon: "tim-icons icon-app",
    component: DataStorage,
    layout: "/admin"
  },
  

];
export default routes;
