import React from 'react'
import classNames from "classnames";
import {
  Button,
  ButtonGroup,
  Row,
} from "reactstrap";
import { Redirect } from 'react-router-dom';
import Charts from './OverviewPanel';
import { useHistory, Switch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom/cjs/react-router-dom';
import Panel from './Panel';
import OverviewIcon from '../assets/icon/overview.png'
import DeviceIcon from '../assets/icon/device.png';
import './Dashboard.scss'

export default function DashboardE({asset, id}) {
    const history = useHistory();
    const location = useLocation();
    const dashboards = useSelector(state => state.dashboards)
    const dashboardSelected = location.pathname.slice(location.pathname.lastIndexOf('/')+1, location.pathname.length)
    const NavigateCreateDashboard = () => {
      history.push(`/admin/device/${asset}/dashboard/add`)
    }
    const buttonDashboards = dashboards.map((element,index)=> {
      return (
      <>
        {element.type == 'dashboard'
        ?
        <>
          <Button
          tag="label"
          className={classNames({
            active: (dashboardSelected == element.id)
          })}
          id={index}
          size="sm"
          onClick={()=>history.push(`/admin/device/${element.asset}/dashboard/${element.id}`)}
          >
              <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                <div>{element.name}</div>
              </span>
              <span className="d-block d-sm-none">
                <i className="tim-icons icon-single-02"/>
              </span>
          </Button>
        </>
        : null
        }
        </>
      )
    })

    return (
    <>
    <div className='header-dashboard'>
    <Row>
      <div className='title'>
        <img src={DeviceIcon}></img>
        {asset}
      </div>
    </Row>
    <Row>
            <div className="tabs">
                    <ButtonGroup
                      data-toggle="buttons"
                    >
                      <Button
                        tag="label"
                        className={classNames({
                          active: false
                        })}
                        id="0"
                        size="sm"
                      >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          <img src={OverviewIcon} style={{width: '16px'}}></img>
                        </span>
                        <span className="d-block d-sm-none">
                          <i className="tim-icons icon-single-02" />
                        </span>
                      </Button>
                      {buttonDashboards}
                      <Button
                        id="1"
                        size="sm"
                        tag="label"
                        onClick={NavigateCreateDashboard}
                      >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          <i className="tim-icons icon-simple-add"></i>
                        </span>
                        <span className="d-block d-sm-none">
                          <i className="tim-icons icon-gift-2" />
                        </span>
                      </Button>
                    </ButtonGroup>
                </div>
        </Row>
    </div>
    <Panel asset={asset} id={id}></Panel>
    </>
  )
}

