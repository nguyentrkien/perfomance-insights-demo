/*!

=========================================================
* Black Dashboard React v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, {useEffect, useRef, useState} from "react";
import "./DataStorage.scss"
import axios from "axios";
import { useSelector } from "react-redux";
import { Pie } from "react-chartjs-2";
import randomColor from 'randomcolor';

function DataStorage() {
  const variables = useSelector(state => state.getVariables);
  const chartReference = useRef(null);
  const [cpuLoad, setCpuLoad] = useState(0);
  const [ramLoad, setRamLoad] = useState(0);
  const [dataSize, setDataSize] = useState([0, "MB"]);
  const [byte, setByte] = useState(0);
  const [version, setVersion] = useState('0.0.0');
  const [isRunning, setIsRunning] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState(randomColor({ count: variables.length }));
  const [isRender, setIsRender] = useState(false)
  const [variableSize, setVariableSize] = useState([]);
  const [variableName, setVariableName] = useState([]);

  const getSystemInfo = async () => {
    const cpu = await axios.get("http://localhost:4000/os/CPUUsage");
    const ram = await axios.get("http://localhost:4000/v8/getHeapStatistics");
    const data = await axios.get("http://localhost:4000/Data/Size");
    const version = await axios.get("http://localhost:4000/Service/Version");
    const IsRunning = await axios.get("http://localhost:4000/Service/IsRunning");
    // const {data} = await axios.get("http://localhost:4000/os/CPUUsage");

    const object = {
      cpu: cpu.data.usage.toFixed(2),
      ram: (100*(ram.data.used_heap_size/ram.data.heap_size_limit)).toFixed(2),
      dataSize: data.data.formattedSize.split(' '),
      byte: data.data.size,
      version: version.data.version,
      IsRunning: IsRunning.data.isRunning
    }

    return object
  }

  const getDataSize = () => {
    const datas = Promise.all(variables.map( async (e) => {
      const {data} = await axios.get(`http://localhost:4000/Data/${e.variableId}/Size`)
      return convert(data.size)
    }))
    return datas
  }

  const convert = (data) => {
    switch (dataSize[1]) {
      case 'GB':
        return (data/(1024*1024*1024)).toFixed(2);
      case 'MB':
        return (data/(1024*1024)).toFixed(2);
      case 'KB':
        return (data/(1024)).toFixed(2);
    }
  }

  useEffect(()=>{
    const interval = setInterval(() => {
      const chart = chartReference.current;
      getSystemInfo()
      .then((data) => {
        setCpuLoad(data.cpu);
        setRamLoad(data.ram);
        setDataSize(data.dataSize);
        setByte(data.byte);
        setIsRunning(data.IsRunning);
      })
      getDataSize()
      .then((data) => {
        setVariableSize(data)
      })
      chart.data.datasets[0].data = variableSize;
      chart.update();
    }, 5*1000);
    return () => clearInterval(interval);
    },[])

  useEffect(()=> {
    variables.map(e => {
      setVariableName(prev => ([...prev, e.variableName]))
    })
    getSystemInfo()
    .then((data) => {
      setCpuLoad(data.cpu);
      setRamLoad(data.ram);
      setDataSize(data.dataSize);
      setByte(data.byte);
      setVersion(data.version);
      setIsRunning(data.IsRunning);
    })
    getDataSize()
    .then((data) => {
      setVariableSize(data)
    })
    setIsRender(true);
  },[])

  return (
    <>
    {isRender
    ?<div className="export-component">
      <div className='add-dashboard-panel2'>
        <div className="content">
          <div className='dashboard-setting2'>
            <div className="h4"> 
              <b>System information</b>
              <div style={{display: 'flex', columnGap: '5px'}}>
                <div style={{opacity: '0.5'}}>
                  Version: {version}
                </div>
                <div style={{display: 'flex', columnGap: '1px'}}>
                  Status: 
                  <div style={{fontWeight: '550',color: `${isRunning?'#91d50ee0':'red'}`}}>
                    {isRunning?'CONNECTED':'DISCONNECTED'}
                  </div>
                </div>
              </div>
            </div>
            <div className="system">
              <div className="element">
                CPU Load
                <div className="card-value">
                  <div className="unit">
                    %
                  </div>
                  <div className="value">
                    {cpuLoad}
                  </div>
                </div>
              </div>
              <div className="element">
                RAM Load
                <div className="card-value">
                  <div className="unit">
                    %
                  </div>
                  <div className="value">
                    {ramLoad}
                  </div>
                </div>
              </div>
              <div className="element">
                Total Database Size
                <div className="card-value">
                  <div className="unit">
                    {dataSize[1]}
                  </div>
                  <div className="value">
                    {dataSize[0]}
                  </div>
                  <div className="byte">
                    {byte} Byte
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='dashboard-setting2'>
            <div className="h4"> 
              <b>Database</b>
            </div>
            
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <div style={{maxWidth: '395px', padding: '0 50px'}}>
                <Pie 
                  ref={chartReference}
                  data={{
                    labels: variableName,
                    datasets: [
                      {
                        data: variableSize,
                        backgroundColor: backgroundColor,
                      },
                    ],
                  }}
                  options = {{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top',
                        align: 'center'
                      },
                      title: {
                        display: true,
                        text: `Size of parameters`
                      },
                      tooltip: {
                        callbacks: {
                          label: (ttItem) => (`${ttItem.label}: ${ttItem.parsed} ${dataSize[1]}`)
                        }
                      }
                    },
                    animation: true,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    :<></>}
    </>
  );
}

export default DataStorage;
