import React, { useEffect, useState } from 'react'
import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom'
import { Button } from 'reactstrap'
import CreateWidget from './CreateWidget';
import { useDispatch, useSelector } from 'react-redux';
import Test from 'variables/Test';
import Draggable from 'react-draggable';
import { updateWidget } from 'store';
import './Panel.scss'


export default function Panel({asset, id}) {
    const history = useHistory();
    const location = useLocation();
    const [disable, setDisable] = React.useState(true);
    const [show, setShow] = React.useState(true)
    const widgetList = useSelector(state => state.widgets);
    
    const widgets = widgetList.map((element, i) => {
        if ((element.asset == asset) && (element.id == id))
        return <Widget element={element} disable={disable} key={i}></Widget>
    })
    console.log(widgets[0])

    const HandleCreateWidget = () => {
        history.push(`/admin/device/${asset}/dashboard/${id}/widget/add`)
    }

    const setshow = () => {
        setShow(prev => (!prev))
        setDisable(prev => (!prev))
    }

    const confirmId = location.pathname.slice(location.pathname.lastIndexOf('/')+1, location.pathname.length);


  return (
    <div className='dashboard'>
        {confirmId == id
        ?<>
        {widgets[0] == undefined
            ?<div>
                No widget has been created yet. {id}
                <Button onClick={HandleCreateWidget}>Create firset widget</Button>
            </div>
            :
            <div>
                <div className='button-header-setting'>
                    <div className={`new ${!show?null:'unactived'}`}>
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

function Widget({element, disable}) {
    const dispatch = useDispatch();
    const [resizing, setResizing] = React.useState(false);
    const [size, setSize] = React.useState({width: element.width, height: element.height})
    const position = {lastX: element.lastX, lastY: element.lastY}
    // const [aspectRatio, setAspectRatio] = React.useState(element.ratio);
    const aspectRatio = element.ratio

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
                <Test parameter={element.parameter[0].name} disable={disable} period='second' size={size} Resize={Resize} setresizing={setresizing} aspectRatio={aspectRatio}></Test>
            </div>
        </Draggable>
    )
}
