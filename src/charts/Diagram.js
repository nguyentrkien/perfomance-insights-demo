import React, { Component, useCallback, useEffect } from 'react';
import { Line, Bar, Chart } from 'react-chartjs-2';
import 'chartjs-adapter-luxon';
import StreamingPlugin from 'chartjs-plugin-streaming';
import classNames from 'classnames';
import { Button, Row, ButtonGroup } from 'reactstrap';
import ResizeIcon from '../assets/icon/resize.png'
import PrintIcon from '../assets/icon/print.png'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getDatas } from 'store';
import XLSX from 'sheetjs-style'
import { saveAs } from 'file-saver'
import { deleteWidget } from 'store';


Chart.register(StreamingPlugin);

function Diagram({element, disable, size, Resize, setresizing, dashboard, assetId}) {
  const dispatch = useDispatch();
  const chartReference = React.useRef(null)
  const resize = React.useRef(null)
  const data = useSelector(state => state.getDatas);

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
    dispatch(getDatas({variableId: element.parameter[0].varId, startDate: dashboard.startDate, toDate: `${dashboard.now? new Date(Date.now()).toISOString():dashboard.toDate}`, timeRange: getPeriod(element.periodNum, element.periodUnit)*1000}));
    console.log(data);
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

  const exportToExcel = () => {
    const chart = chartReference.current;
    console.log(chart.data.datasets[0].data);
    const data = chart.data.datasets[0].data.map((e,i)=>{
      return {Date: new Date(e.x).toLocaleString(),Value: e.y}
    });
  
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileName = 'myData.xlsx';
    const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
    saveAs(file, fileName);
  };

  const handleDelete = async () => {
    const widget = {
      _id: assetId,
      id_widget: element.id_widget
    }
    await axios.post("http://localhost:4000/user/deleteWidget", widget)
    dispatch(deleteWidget({id: dashboard.id, id_widget: element.id_widget})) 
  }

  const getData = async () => {
    if (element.parameter[0].type == 'VAR')
    {
      var dataRequest = JSON.stringify({
        "from": `${new Date(Date.now()-getPeriod(element.periodNum, element.periodUnit)*1000).toISOString()}`,
        "to": `${new Date(Date.now()).toISOString()}`,
        "calculationTimeRange": getPeriod(element.periodNum, element.periodUnit)*1000,
        "dataSources": [
          {
            "id": `${element.parameter[0].varId}`,
            "type": "Variable",
            "aggregation": "Average"
          }
        ]
      });
      
      var config = {
          method: 'post',
          url: 'http://localhost:4000/CalculateTrend',
          headers: { 
            'Content-Type': 'application/json'
          },
          data : dataRequest
        };
      var {data} = await axios(config);
      console.log(data)
      return data[0].values[0].value
    }
    else {
      const listData = await Promise.all(element.parameter[0].listVar.map( async (item)=>{
        var dataRequest = JSON.stringify({
          "from": `${new Date(Date.now()-getPeriod(element.periodNum, element.periodUnit)*1000).toISOString()}`,
          "to": `${new Date(Date.now()).toISOString()}`,
          "calculationTimeRange": getPeriod(element.periodNum, element.periodUnit)*1000,
          "dataSources": [
            {
              "id": `${item.varId}`,
              "type": "Variable",
              "aggregation": "Average"
            }
          ]
        });
        
        var config = {
            method: 'post',
            url: 'http://localhost:4000/CalculateTrend',
            headers: { 
              'Content-Type': 'application/json'
            },
            data : dataRequest
          };
        var {data} = await axios(config);
        return data[0].values[0].value
      }))
      const calculateKPI = new Function(...element.parameter[0].listVar.map((item) => item.text), `return ${element.parameter[0].formula}`)
      return calculateKPI(...listData)

    }
  }

  return (
    <>
    <img className='print-button' 
      src={PrintIcon} 
      draggable="false"
      onClick={exportToExcel}
      ></img>
    <i className='tim-icons icon-trash-simple delete' 
      style={!disable?null:{display: 'none'}}
      onClick={handleDelete}
      ></i>
    {(element.parameter && (data.length != 0))
      ?<>
      <Line
        ref={chartReference}
        data={{
          datasets: [{
            label: `${element.alternativeLabel?element.alternativeLabel:element.parameter[0].name}`,
            fill: false,
            backgroundColor: `${element.color}`,
            borderColor: `${element.color}`,
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: `${element.color}`,
            pointBorderColor: "rgba(255,255,255,0)",
            pointHoverBackgroundColor: "#1f8ef1",
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 2,
            lineTension: 0,
            data: data[0].values.map((e) => {
              return {x: (new Date(e.timestamp)).getTime(), y: e.value.toFixed(element.decimalNumber)}
            })
          }]
        }}
        options={(dashboard.now)
          ?{plugins:{
            legend: {
              display: false,
              align: 'center',
            },
            title: {
              align: 'center',
              padding: 0,
              display: true,
              text: `${element.widgetName}`
            },
            subtitle: {
              display: true,
              padding: 5,
              font: {
                size: 8,
                weight: 50,
              },
              text: `${(new Date(dashboard.startDate)).toLocaleString()} - now, period: ${element.periodNum,element.periodUnit}`
            }
          },
          scales: {
            x: {
                type: 'realtime',
                realtime: {
                  delay: 0,
                  frameRate: 30,
                  duration: ((new Date(dashboard.toDate)).getTime()-(new Date(dashboard.startDate)).getTime() + 10000*100), //1day  
                  refresh: getPeriod(element.periodNum, element.periodUnit)*1000,
                  onRefresh: chart => {
                    getData()
                      .then((data) => {
                        chart.data.datasets[0].data.push({
                          x: (Date.now()),
                          y: data.toFixed(element.decimalNumber),
                        });
                      })
                    }
              },
            },
            y: {
              title: {
                text: `${element.yAxisLabel}`,
                align: "center",
                display: true,
              }
            }
          },
          animation: false,
          aspectRatio: element.ratio,
        }
        : null
      }
        />

      <img className='resize-button' 
      src={ResizeIcon} 
      ref={resize}
      draggable="false"
      style={!disable?{cursor: 'nw-resize'}:null}
      ></img>
    </>
    :null
  }
  </>
  );
}

export default Diagram;