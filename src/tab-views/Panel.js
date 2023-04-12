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
import { getDatas } from 'store';
import { StrictMode } from 'react';
import './Panel.scss'
import './Dashboard.scss'


export default function Panel({asset, id, dashboard}) {
    const history = useHistory();
    const dispatch = useDispatch();
    const location = useLocation();
    const [disable, setDisable] = React.useState(true);
    const [show, setShow] = React.useState(true)

    let widgetList = useSelector(state => state.widgets);
    widgetList = widgetList.filter(element => (element.asset == asset) && (element.id == id));

    //day of dashboard
    // console.log(dashboard.startDate, dashboard.toDate)
    // const toDate = new Date(new Date(dashboard.startDate).getTime() + 60 * 60 * 24 * 1000);

    const widgets = widgetList.map((element, i) => {
        console.log(element);
        return <Widget element={element} disable={disable} dashboard={dashboard} key={i}></Widget>
    })

    const HandleCreateWidget = () => {
        history.push(`/admin/device/${asset}/dashboard/${id}/widget/add`)
    }

    const setshow = () => {
        setShow(prev => (!prev))
        setDisable(prev => (!prev))
    }

    const confirmId = location.pathname.slice(location.pathname.lastIndexOf('/')+1, location.pathname.length);

    // useEffect(()=>{
    //     if (dataIdList.length != 0)
    //         dispatch(getDatas({variableIdList: dataIdList, startDate: dashboard.startDate, toDate: toDate.toISOString()}));
    // },[])

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
                render={()=><CreateWidget asset={asset} id={id}></CreateWidget>}
                ></Route>
        </Switch>
    </div>
  )
}

function Widget({element, disable, dashboard}) {
    const dispatch = useDispatch();
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

    console.log(size)

    return (
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
                                />,
                    "Pie": <PieChart 
                                className='pie-chart'
                                element={element} 
                                disable={disable} 
                                size={size} 
                                Resize={Resize} 
                                setresizing={setresizing}
                                dashboard={dashboard}
                                />,
                    "Gauge":
                            <Gauge 
                                element={element} 
                                disable={disable} 
                                size={size} 
                                Resize={Resize} 
                                setresizing={setresizing}
                                dashboard={dashboard}
                                />
                    }[element.widgetType]
                }
            </div>
        </Draggable>
    )
}
