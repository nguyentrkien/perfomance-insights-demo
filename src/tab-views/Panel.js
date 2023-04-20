import React, { useEffect, useState } from 'react'
import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom'
import { Button } from 'reactstrap'
import CreateWidget from './CreateWidget';
import { useDispatch, useSelector } from 'react-redux';
import Diagram from '../charts/Diagram';
import PieChart from 'charts/PieChart';
import Gauge from 'charts/Gauge'
import Draggable from 'react-draggable';
import { updateWidget } from 'store';
import { getDatas, deleteDashboard } from 'store';
import { StrictMode } from 'react';
import NotificationAlert from "react-notification-alert";
import './Panel.scss'
import './Dashboard.scss'
import axios from 'axios';


export default function Panel({asset, id, dashboard, assetId}) {
    const history = useHistory();
    const dispatch = useDispatch();
    const location = useLocation();
    const [disable, setDisable] = React.useState(true);
    const [show, setShow] = React.useState(true);
    const [showConfirmation, setShowConfirmation] = useState(false);
    let widgetList = useSelector(state => state.auth.login.currentUser?.widgets);
    widgetList = widgetList.filter(element => (element.asset == asset) && (element.id == id));
    //day of dashboard
    // console.log(dashboard.startDate, dashboard.toDate)
    // const toDate = new Date(new Date(dashboard.startDate).getTime() + 60 * 60 * 24 * 1000);

    const widgets = widgetList.map((element, i) => {
        return <Widget element={element} disable={disable} dashboard={dashboard} assetId={assetId} key={i}></Widget>
    })

    const HandleCreateWidget = () => {
        history.push(`/admin/device/${asset}/dashboard/${id}/widget/add`)
    }

    const setshow = () => {
        setShow(prev => (!prev))
        setDisable(prev => (!prev))
    }

    const confirmId = location.pathname.slice(location.pathname.lastIndexOf('/')+1, location.pathname.length);

    const handleConfirmDelete = async () => {
        const info = {
            "id": dashboard.id,
            "_id": assetId,
        }
        dispatch(deleteDashboard(info));
        await axios.post('http://localhost:4000/user/deleteDashboard', info);
    }

  return (
    <div className='dashboard'>
        {confirmId == id
        ?<>
        {((widgets.length == 0))
            ?
            <div className='dashboard-panel'>
                <i className='tim-icons icon-puzzle-10 puzzle'></i>
                <h4>No widget has been created yet.</h4>
                <Button onClick={HandleCreateWidget}>Create firset widget</Button>
            </div>
            :
            <div>
                <Confirmation 
                dashboard={dashboard}
                showConfirmation={showConfirmation} 
                setShowConfirmation={setShowConfirmation} 
                handleConfirmDelete={handleConfirmDelete}>
                </Confirmation>
                <div className='button-header-setting'>
                    <div className={`new ${!show?null:'unactived'}`} onClick={HandleCreateWidget}>
                        <i className='tim-icons icon-simple-add'></i>
                        <div> New Widget </div>
                    </div>
                    <div className={`save ${!show?null:'unactived'}`} onClick={setshow}>
                        <i className='tim-icons icon-notes'></i>
                        <div> Save </div>
                    </div>
                    <div className={`setting ${show?null:'unactived'}`} onClick={setshow}>
                        <i className='tim-icons icon-settings-gear-63'></i>
                    </div>
                    <div className={`setting ${show?null:'unactived'}`} onClick={e => setShowConfirmation(true)} >
                        <i className='tim-icons icon-basket-simple'></i>
                    </div>
                </div>
                <div className={`container ${show?null:'edit'}`}>
                    {widgets}
                </div>
            </div>
        }
        </>
        : null}
        <Switch>
            <Route 
                path={`/admin/device/${asset}/dashboard/${id}/widget/add`}
                render={()=><CreateWidget asset={asset} id={id} assetId={assetId}></CreateWidget>}
                ></Route>
        </Switch>
    </div>
  )
}

function Confirmation ({dashboard, showConfirmation, setShowConfirmation, handleConfirmDelete}) {
    return ( 
        <>
        {showConfirmation && (<div className='confirm-bg' onClick={() => setShowConfirmation(false)}>
            <div className='dialog'>
                <div>
                <div style={{marginBottom: '5px'}}>Are you sure you want to delete <b>{dashboard.name}</b>?</div>
                <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
                    <button type='Yes' onClick={handleConfirmDelete}>Yes</button>
                    <button type='No' onClick={() => setShowConfirmation(false)}>No</button>
                </div>
                </div>
            </div>
        </div>)}
        </>
    )
}

function Widget({element, disable, dashboard, assetId}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [resizing, setResizing] = React.useState(false);
    const [size, setSize] = React.useState({width: element.width, height: element.height})
    const position = {lastX: element.lastX, lastY: element.lastY}
    const Resize = (dx,dy) => {
        setSize(prevState => {
            dispatch(updateWidget({
                ...element,
                type: 'resize',
                height: `${parseInt(prevState.height,10) + dy}`, 
                width: `${parseInt(prevState.width,10) + dx}`,
                ratio: (parseInt(prevState.width,10) + dx)/(0.85*(parseInt(prevState.height,10) + dy)),
            }))
            return {
                height: `${parseInt(prevState.height,10) + dy}`,
                width: `${parseInt(prevState.width,10) + dx}` 
        }})
    }

    const eventHandler = (e, data) => {
        dispatch(updateWidget({
            ...element,
            type: 'position',
            lastX: data.lastX,
            lastY: data.lastY,
        }))
    }

    const setresizing = (bool) => {
        setResizing(bool);
    }

    const notificationAlertRef = React.useRef(null);
    const notify = (type, message) => {
      var options = {};
      var icon;
      switch(type){
        case "warning":
            icon = "tim-icons icon-alert-circle-exc";
            break
        case "danger":{
            icon = "tim-icons icon-alert-circle-exc";
            break
        }
        case "info":{
          icon = "tim-icons icon-basket-simple";
          break
        }
        case "success":{
          icon = "tim-icons icon-check-2";
          break
        }
      }
      options = {
        place: 'br',
        message: (
          <div>
            <div>
              {message}
            </div>
            <div>See Detail in Alert History Tab</div>
          </div>
        ),
        type: type,
        icon: icon,
        autoDismiss: 7
      };
      notificationAlertRef.current.notificationAlert(options);
    };

    return (
        <>
        <div className="react-notification-alert-container">
            <NotificationAlert ref={notificationAlertRef}/>
        </div>
        <Draggable 
            disabled={disable || resizing} 
            bounds='parent' 
            defaultPosition={{x: position.lastX, y: position.lastY}}
            onDrag={eventHandler}>    
            <div 
                className='widgets-panel' 
                style={{width: `${size.width}px`,height: `${size.height}px`}}
                >
                { 
                    {"Diagram":<Diagram 
                                element={element} 
                                disable={disable} 
                                size={size} 
                                Resize={Resize} 
                                setresizing={setresizing}
                                dashboard={dashboard}
                                assetId = {assetId}
                                />,
                    "Pie": <PieChart 
                                className='pie-chart'
                                element={element} 
                                disable={disable} 
                                size={size} 
                                Resize={Resize} 
                                setresizing={setresizing}
                                dashboard={dashboard}
                                assetId = {assetId}
                                />,
                    "Gauge":
                            <Gauge 
                            element={element} 
                                disable={disable} 
                                size={size} 
                                Resize={Resize} 
                                setresizing={setresizing}
                                dashboard={dashboard}
                                assetId = {assetId}
                                notify={notify}
                                />
                            }[element.widgetType]
                        }
            </div>
        </Draggable>
        </>
    )
}
