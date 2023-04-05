import { useSelector } from "react-redux";
import Dashboard from "views/Dashboard.js";
import Icons from "views/Icons.js";

// const assets = useSelector((state)=> state.getAssets);



var devices = [
  {
    path: "/1/dashboard",
    name: "Device 1",
    icon: "tim-icons icon-tv-2",
    component: Dashboard,
    layout: "/admin/device"
  },
  {
    path: "/2/dashboard",
    name: "Device 2",
    icon: "tim-icons icon-tv-2",
    component: Icons,
    layout: "/admin/device"
  },
];
export default devices;
