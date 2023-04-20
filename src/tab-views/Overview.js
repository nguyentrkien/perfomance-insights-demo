import React from 'react'
import classNames from "classnames";
import {
  Button,
  ButtonGroup,
  Row,
} from "reactstrap";
import OverviewPanel from './OverviewPanel';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import OverviewIcon from '../assets/icon/overview.png'
import DeviceIcon from '../assets/icon/device.png';
import './Dashboard.scss'

export default function Overview({asset}) {
    const history = useHistory();
    const dashboards = useSelector(state => state.auth.login.currentUser?.dashboards);
    const NavigateCreateDashboard = () => {
      history.push(`/admin/device/${asset}/dashboard/add`)
    }
    const buttonDashboards = dashboards.map((element,index)=> {
      return (
      <>
        {element.type == 'dashboard'
        ?<Button
        tag="label"
        className={classNames("btn-simple", {
          active: false
        })}
        color="info"
        id={index}
        size="sm"
        onClick={()=>history.push(`/admin/device/${element.asset}/dashboard/${element.id}`)}
        >
            <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
              <div>{element.name}</div>
            </span>
            <span className="d-block d-sm-none">
              <i className="tim-icons icon-single-02" />
            </span>
        </Button>
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
                          active: true
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
    <OverviewPanel NavigateCreateDashboard={NavigateCreateDashboard}></OverviewPanel>
    </>
  )
}

