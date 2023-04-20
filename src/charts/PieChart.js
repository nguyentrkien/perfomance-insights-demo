import React, { Component, useCallback, useEffect } from 'react';
import { Line, Bar, Chart, Pie } from 'react-chartjs-2';
import 'chartjs-adapter-luxon';
import StreamingPlugin from 'chartjs-plugin-streaming';
import classNames from 'classnames';
import { Button, Row, ButtonGroup } from 'reactstrap';
import ResizeIcon from '../assets/icon/resize.png'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleData } from 'store';
import './chart.scss'
import { deleteWidget } from 'store';

Chart.register(StreamingPlugin);

function PieChart({element, disable, size, Resize, setresizing, dashboard, assetId}) {
  const dispatch = useDispatch();
  const chartReference = React.useRef(null)
  const resize = React.useRef(null)
  // const data = useSelector(state => state.singleData);
  const [isGetData, setIsGetData] = React.useState(false);
  const [initData, setInitData] = React.useState([])

  const Labels = element.multiSelect.map((e,i)=> {
    return e.alt
  })

  const Colors = element.multiSelect.map((e,i)=> {
    return e.color
  })

  const getPeriod = (num, unit) => {
    let timeUnit
    switch (unit){
      case "Hour(s)":
        timeUnit = 3600;
        break
      case "Minute(s)":
        timeUnit = 60;
        break
      default:
        timeUnit = 1;
    }
    return num*timeUnit
  }

  useEffect(()=>{
      const interval = setInterval(() => {
          const chart = chartReference.current;
          getData()
            .then((data) =>{setInitData(data)})
          chart.data.datasets[0].data = initData;
          chart.update();
      }, getPeriod(element.periodNum, element.periodUnit)*1000);
      return () => clearInterval(interval);
  },[])

  useEffect(()=>{
    if(!disable){
      let x = 0;
      let y = 0;
      const onMouseMoveResize = (e) => {
        const dx = e.pageX - x;
        const dy = e.pageY - y;
        x = e.pageX;
        y = e.pageY;
        Resize(dx, dy);
      }
      
      const onMouseUpResize = (e) => {
        document.removeEventListener('mousemove',onMouseMoveResize)
        setresizing(false);
      }
      
      const onMouseDownResize = (e) => {
        setresizing(true);
        x = e.pageX;
        y = e.pageY;
        document.addEventListener('mousemove',onMouseMoveResize);
        document.addEventListener('mouseup',onMouseUpResize);
      }

      const resizeButton = resize.current;
      resizeButton.addEventListener('mousedown', onMouseDownResize);

      return () => {
        resizeButton.removeEventListener('mousedown', onMouseDownResize);
      }
    }
  },[disable])

  const getData = async () => {
    const a = await Promise.all(element.multiSelect.map(async(e) => {
      const {data:{data}}= await axios.get(`http://localhost:4000/Data/${e.varId}?from=${new Date(Date.now()-getPeriod(element.periodNum, element.periodUnit)*1000).toISOString()}&to=${new Date(Date.now()).toISOString()}`)
      console.log(data[0].values[0].value)
      return (data[0].values[0].value)
    }))
    return a
  }

  
  useEffect(()=>{
    getData()
      .then((data) =>{setInitData(data)})
    setIsGetData(prev=>!prev)
  },[])

  const handleDelete = async () => {
    const widget = {
      _id: assetId,
      id_widget: element.id_widget
    }
    console.log(assetId,element.id_widget)
    await axios.post("http://localhost:4000/user/deleteWidget", widget)
    dispatch(deleteWidget({id: dashboard.id, id_widget: element.id_widget}))
    
  }


  return (
    <div className='pie-chart'>
      {isGetData
      ?<>
      <i className='tim-icons icon-trash-simple delete' 
      style={!disable?null:{display: 'none'}}
      onClick={handleDelete}
      ></i>
      <Pie 
      ref={chartReference}
      data={{
        labels: Labels,
        datasets: [
          {
            data: initData,
            backgroundColor: Colors,
          },
        ],
      }}
      options = {{
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          title: {
            display: true,
            text: `${element.widgetName}`
          },
          subtitle: {
            display: true,
            font: {
              size: 8,
              weight: 50,
            },
            text: `${(new Date(dashboard.startDate)).toLocaleDateString()}, period: ${element.periodNum,element.periodUnit}`
          }
        },
        animation: true,
      }}
    />
      <img className='resize-button' 
      src={ResizeIcon} 
      ref={resize}
      draggable="false"
      style={!disable?{cursor: 'nw-resize'}:null}
      ></img>
    </>
    : null}
  </div>
  );
}

export default PieChart;