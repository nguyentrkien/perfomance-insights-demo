import React, { useEffect } from 'react';
import { Chart, Doughnut } from 'react-chartjs-2';
import 'chartjs-adapter-luxon';
import StreamingPlugin from 'chartjs-plugin-streaming';
import ResizeIcon from '../assets/icon/resize.png'
import axios from 'axios';
import 'chartjs-plugin-datalabels';
import 'chartjs-plugin-annotations';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleData, deleteWidget, addHistoryAlert } from 'store';
import { v4 as uuid } from 'uuid';
import './chart.scss'

Chart.register(StreamingPlugin);

function Gauge({element, disable, size, Resize, setresizing, dashboard, assetId, notify}) {
  const dispatch = useDispatch();
  const chartReference = React.useRef(null)
  const resize = React.useRef(null)
  // const data = useSelector(state => state.singleData);
  const [isGetData, setIsGetData] = React.useState(false);
  const [initData,setInitData] = React.useState([]);
  const [initNeedle,setInitNeedle] = React.useState();
  const [dataValue, setDataValue] = React.useState(0);
  const [dataMax, setDataMax] = React.useState(0);
  const [dataMin, setDataMin] = React.useState(0);

  //calculate period
  const getPeriod = (num, unit) => {
    let timeUnit
    switch (unit){
      case "Hour":
        timeUnit = 3600;
        break
      case "Minute":
        timeUnit = 60;
        break
      default:
        timeUnit = 1;
    }
    return num*timeUnit
  }

  //init arcs
  useEffect(()=>{
      setInitData([(element.lowlimitalert-element.minRange),
        (element.lowlimitwarning-element.lowlimitalert),
        (element.highlimitwarning-element.lowlimitwarning),
        (element.highlimitalert-element.highlimitwarning),
        (element.maxRange - element.highlimitalert)])
  },[])

  //resize chart
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
  
  //async function fetch data
  const getData = async (aggregation) => {
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
            "aggregation": aggregation
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

  const sendEmail = async (email, subject, message) => {
    var data = JSON.stringify({
      "email": email,
      "subject": subject,
      "content": message
    });
    
    var config = {
      method: 'post',
      url: 'http://localhost:4000/email/send',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    await axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  //setInterval
  useEffect(()=>{
    getData('Average')
    .then((data) =>{setInitNeedle(data.toFixed(element.decimalNumber)); setDataValue(data);})
    getData('Max')
    .then((data) => {
      setDataMax(data);
    })
    getData('Min')
    .then((data) => {
      setDataMin(data);
    })
    const interval = setInterval(() => {
      if(element.warning){
        const chart = chartReference.current;
        getData('Average')
        .then((data) => {
          chart.data.datasets[0].needleValue = data.toFixed(element.decimalNumber);
          chart.update();
              if (data <= element.lowlimitalert)
              {
                sendEmail(element.email, "[Alert !!!]", `Parameter ${element.parameter[0].name} has exceed the allowable threshold at ${(new Date(Date.now())).toLocaleString()} with value = ${data.toFixed(element.decimalNumber)}` );
                notify("alert","Threshold Crossing Alert")
                let id = uuid().slice(0,8);
                dispatch(addHistoryAlert({
                  id: id,
                  parameter: element.parameter[0].name,
                  type: element.parameter[0].type,
                  alertType: 'Alert',
                  value: data.toFixed(element.decimalNumber),
                  date: (new Date(Date.now())).toLocaleString()
                }))
              }
              else if ((data >= element.lowlimitalert) && ((data <= element.lowlimitwarning)))
              {
                console.log('warning')
                let id = uuid().slice(0,8);
                notify("warning","Threshold Crossing Warning");
                dispatch(addHistoryAlert({
                  id: id,
                  parameter: element.parameter[0].name,
                  type: element.parameter[0].type,
                  alertType: 'Warning',
                  value: data.toFixed(element.decimalNumber),
                  date: (new Date(Date.now())).toLocaleString()
                }))
              }
              else if ((data >= element.highlimitwarning) && ((data <= element.highlimitalert)))
              {
                console.log('warning')
                let id = uuid().slice(0,8);
                notify("warning","Threshold Crossing Warning")
                dispatch(addHistoryAlert({
                  id: id,
                  parameter: element.parameter[0].name,
                  type: element.parameter[0].type,
                  alertType: 'Warning',
                  value: data.toFixed(element.decimalNumber),
                  date: (new Date(Date.now())).toLocaleString()
                }))
              }
              else if (data >= element.highlimitalert)
              {
                sendEmail(element.email, "[Alert !!!]", `Parameter ${element.parameter[0].name} has exceed the allowable threshold at ${(new Date(Date.now())).toLocaleString()} with value = ${data.toFixed(element.decimalNumber)}` );
                notify("danger","Threshold Crossing Alert")
                let id = uuid().slice(0,8);
                dispatch(addHistoryAlert({
                  id: id,
                  parameter: element.parameter[0].name,
                  type: element.parameter[0].type,
                  alertType: 'Alert',
                  value: data.toFixed(element.decimalNumber),
                  date: (new Date(Date.now())).toLocaleString()
                }))
              }
          }
        )
      }
      else {
        getData('Average')
        .then((data) => {
          setDataValue(data);
        })
        getData('Max')
        .then((data) => {
          setDataMax(data);
        })
        getData('Min')
        .then((data) => {
          setDataMin(data);
        })
      }

      // chart.data.datasets[0].needleValue = data.toFixed(element.decimalNumber);
      // console.log(data)
    }, getPeriod(element.periodNum, element.periodUnit)*1000);
    return () => clearInterval(interval);
  },[])

      
  const options = {
      type: 'doughnut',
      plugins: [{
        afterDraw: chart => {
          var needleValue = chart.config.data.datasets[0].needleValue;
          var dataTotal = chart.config.data.datasets[0].data.reduce((a, b) => a + b, 0);
          var angle = Math.PI + (1 / dataTotal * (needleValue - element.minRange) * Math.PI);
          var ctx = chart.ctx;
          var cw = chart.canvas.offsetWidth;
          var ch = chart.canvas.offsetHeight;
          var cx = cw / 2;
          var cy = ch - 36;
    
          ctx.translate(cx, cy);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.moveTo(0, -3);
          ctx.lineTo(ch - 110, 0);
          ctx.lineTo(0, 3);
          ctx.fillStyle = 'rgb(0, 0, 0)';
          ctx.fill();
          ctx.rotate(-angle);
          ctx.translate(-cx, -cy);
          ctx.beginPath();
          ctx.arc(cx, cy, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = "16px Arial";
          ctx.fillStyle = 'black';
          ctx.fillText(`${element.minRange}`,cx/2.5, cy+15);
          ctx.fillText(`${element.maxRange}`,cx*3/2, cy+15);
          ctx.font = 'bold 16px Arial';
          ctx.fillStyle = 'black';
          ctx.textAlign = 'center';
          ctx.fillText(`${needleValue}`,cx, cy+20);
          ctx.font = 'bold 12px Arial';
          ctx.fillStyle = 'grey';
          ctx.textAlign = 'center';
          ctx.fillText(`${element.UnitGauge}`,cx, cy+30);
        }
      }],
      data: {
        labels: ['Alert', 'Warning', 'OK'],
        datasets: [{
          data: initData,
          needleValue: initNeedle,
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 206, 86)',
            'rgb(63, 191, 63)',
            'rgb(255, 206, 86)',
            'rgb(255, 99, 132)'
          ]
        }]
      },
      options: {
        responsive: true,
        aspectRatio: 1.4,
        plugins:{
          legend: {
            display: true,
            align: 'center',
          },
          title: {
            align: 'center',
            display: true,
            padding: 0,
            font: {
              size: 16,
              weight: 700,
            },
            text: `${element.widgetName}`
          },
          subtitle: {
            display: true,
            padding: 5,
            font: {
              size: 10,
              weight: 50,
            },
            text: `${(new Date(dashboard.startDate)).toLocaleDateString()}, period: ${element.periodNum} ${element.periodUnit}, path: ${element.parameter[0].path}`
          },
        },
        layout: {
          padding: {
            bottom: 30,
          }
        },
        rotation: -90,
        cutout: '50%',
        circumference: 180,
        legend: {
          display: false
        },
        events: [],
        animation: {
          animateRotate: false,
          animateScale: false,
        }
      }
  };

  const handleDelete = async () => {
    // const widget = {
    //   _id: assetId,
    //   id_widget: element.id_widget
    // }
    // console.log(assetId,element.id_widget)
    // await axios.post("http://localhost:4000/user/deleteWidget", widget)
    dispatch(deleteWidget({id: dashboard.id, id_widget: element.id_widget}))
    
  }

  return (
    <div>
      {element.warning
        ?<Doughnut ref={chartReference} plugins={options.plugins} data={options.data} options={options.options} />
        :<div className="system">
              <div className="element" style={{border: 'none'}}>
                <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                  <b>{element.widgetName}</b>
                  <div style={{fontSize: '10px', opacity: '0.6'}}>
                    {(new Date(dashboard.startDate)).toLocaleDateString()}, path: {element.parameter[0].path}
                  </div>
                </div>
                <div className="card-value" style={{height: '50%'}}>
                  <div className="value">
                  {dataValue.toFixed(element.decimalNumber)}
                  </div>
                  <div className="unit" style={{lineHeight: '0'}}>
                    {element.UnitGauge}
                  </div>
                </div>
                <div style={{display: 'flex', marginTop: '10px'}}>
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'calc(100%/3)'}}>
                    <div>{element.periodNum} {element.periodUnit}</div>
                    <div style={{fontSize: '11px', opacity: '0.8'}}>Period</div>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'calc(100%/3)'}}>
                    <div>{dataMax}</div>
                    <div style={{fontSize: '11px', opacity: '0.8'}}>MAX</div>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'calc(100%/3)'}}>
                    <div>{dataMin}</div>
                    <div style={{fontSize: '11px', opacity: '0.8'}}>MIN</div>
                  </div>
                </div>
              </div>
          </div>
      }
      <i className='tim-icons icon-trash-simple delete' 
      style={!disable?null:{display: 'none'}}
      onClick={handleDelete}
      ></i>
      <img className='resize-button' 
      src={ResizeIcon} 
      ref={resize}
      draggable="false"
      style={!disable?{cursor: 'nw-resize'}:null}
      ></img>
  </div>
  );
}

export default Gauge;