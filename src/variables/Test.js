import React, { Component, useEffect } from 'react';
import { Line, Chart } from 'react-chartjs-2';
import 'chartjs-adapter-luxon';
import StreamingPlugin from 'chartjs-plugin-streaming';
import classNames from 'classnames';
import { Button, Row, ButtonGroup } from 'reactstrap';
import ResizeIcon from '../assets/icon/resize.png'

Chart.register(StreamingPlugin);

const data1 = (canvas) => {
  let ctx = canvas.getContext("2d");

  let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

  gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
  gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
  gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

  return {
    datasets: [{
      fill: true,
      backgroundColor: gradientStroke,
      borderColor: "#1f8ef1",
      borderWidth: 2,
      borderDash: [],
      borderDashOffset: 0.0,
      pointBackgroundColor: "#1f8ef1",
      pointBorderColor: "rgba(255,255,255,0)",
      pointHoverBackgroundColor: "#1f8ef1",
      pointBorderWidth: 20,
      pointHoverRadius: 4,
      pointHoverBorderWidth: 15,
      pointRadius: 4,
      lineTension: 0,
      data: []
    }]
}}

function Test({parameter, disable, period, size, Resize, setresizing, aspectRatio}) {
  const [actionButton, setactionButton] = React.useState("start");
  const resize = React.useRef(null)
  // const {varList, dispatch: dispatchVar} = React.useContext(varContext);
  const [pause, setPause] = React.useState(false);
  const [mul, setMul] = React.useState(1);
  
  const chartExample1 = {
    options: {
      plugins:{
        legend: false,
        title: {
          align: 'center',
          display: true,
          text: `${parameter}`
        }
      },
      scales: {
        x: {
          type: 'realtime',
          time: {
            unit: `${period}`,
          },
          realtime: {
            delay: 1000,
            frameRate: 30, //fps
            duration: 10000*mul, //x-axis displays 10minute
            refresh: 1000*mul,
            pause: pause,
            onRefresh: chart => {
              chart.data.datasets.forEach(dataset => {
                let a = Math.random()
                dataset.data.push({
                  x: Date.now(),
                  y: a,
                });
                // if(warningValue.length > 0)
                //   if(a>parseFloat(warningValue[0].HighLimitWarning)){
                //     const time = new Date(Date.now());
                //     notify("warning",`Warning: Over thresholds at ${time.toLocaleDateString()} ${time.toLocaleTimeString()} GMT+7`)
                //   }
              });
            }
          }
        },
        y: {
          max: 1,
          min: 0,
        }
      },
      animation: false,
      aspectRatio: aspectRatio,
    }
  }

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

      const resizeButton = resize.current
      resizeButton.addEventListener('mousedown', onMouseDownResize);

      return () => {
        resizeButton.removeEventListener('mousedown', onMouseDownResize);
      }
    }
  },[disable])

  
  useEffect(()=>{
    switch(period) {
      case 'second':
      {
        setMul(1);
        break
      }
    case 'minute':
      {
        setMul(60);
        break
      }
    case 'hour':
      {
        setMul(3600);
        break
      }
  }
  },[period])
  
  const setActionButton = (name) =>{
    setactionButton(name);
  }

  return (
    <>
    {parameter
      ?<>
      <Row>
                <ButtonGroup
                      className="btn-group-toggle float-right"
                      data-toggle="buttons"
                    >
                      <Button
                        tag="label"
                        className={classNames("btn-simple", {
                          active: actionButton === "pause"
                        })}
                        color="info"
                        id="0"
                        size="sm"
                        onClick={() => {setActionButton("pause"); setPause(true)}}
                      >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Pause
                        </span>
                        <span className="d-block d-sm-none">
                          <i className="tim-icons icon-single-02" />
                        </span>
                      </Button>
                      <Button
                        tag="label"
                        className={classNames("btn-simple", {
                          active: actionButton === "start"
                        })}
                        color="info"
                        id="0"
                        size="sm"
                        onClick={() => {setActionButton("start"); setPause(false)}}
                      >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Start
                        </span>
                        <span className="d-block d-sm-none">
                          <i className="tim-icons icon-single-02" />
                        </span>
                      </Button>
                    </ButtonGroup>
                </Row>
      <Line
        data={data1}
        options={chartExample1.options}
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

export default Test;