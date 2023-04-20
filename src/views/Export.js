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
import React, { useCallback, useState }from "react";
import { Input, Form } from "reactstrap";
import Select from "react-select";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Flatpickr from "react-flatpickr";
import XLSX from 'sheetjs-style'
import { saveAs } from 'file-saver'
import axios from 'axios';
import element from "chartjs-plugin-annotations/src/element";
import Logo from '../assets/img/ThanhThienlogo.png'
import exportIcon from '../assets/img/export.png'

function Export () {
    const [checked, setChecked] = useState(true);
    const [selectedOption, setSelectedOption] = React.useState([])
    const periodList = useSelector(state => state.period);
    const varList = useSelector((state)=>state.getVariables);
    const aggregations = useSelector((state)=>state.Aggregation);
    const period = periodList.map((element, index) => {
        return <option value={element} key={index}>{element}</option>
    });

    const aggregation = aggregations.map((element, index) => {
        return <option value={element} key={index}>{element}</option>
    });

    const varop = varList.map((element, i)=>{
        return {value: `${element.variableName}`, label: `${element.variableName}`, type:`VAR`, color: `#${Math.floor(Math.random()*16777215).toString(16)}`, dec: 2, alt: '', varId: `${element.variableId}`}
    });
    const today = new Date();
    const groupedOptions = [
        {
          label: "VAR",
          options: varop
        },
        {
          label: "KPI",
          options: []
        }
    ];

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
      };

    const getData = async ({variableId, startDate, toDate, aggregation, period}) => {
        var timeRange
        switch(period){
          case("minute"):
            timeRange = 60000;
            break
          case("hour"):
            timeRange = 60000*60;
            break
          case("day"):
            timeRange = 60000*60*24;
            break
        }
        var dataRequest = JSON.stringify({
            "from": `${startDate}`,
            "to": `${toDate}`,
            "calculationTimeRange": timeRange,
            "dataSources": [
              {
                "id": `${variableId}`,
                "type": "Variable",
                "aggregation": `${aggregation}`
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
        return data[0]
    }


    const exportToExcel = (name, varName, data, aggregation, period) => {
        const datas = data.reduce((previous, current, currentIndex) => {
          return [...previous, ...current.values.map((e,i)=> {return {Date: new Date(e.timestamp).toLocaleString(), [varName[currentIndex]]:e.value}})]
        },[])
        
        const result = Object.values(datas.reduce((acc, obj) => {
          const key = obj.Date;
          if (!acc[key]) {
            acc[key] = { Date: key };
          }
          Object.assign(acc[key], obj);
          return acc;
        }, {}));

        const header = [{title: 'THANH THIEN TECHNOLOGY JSC'}];
        const info = [
        {title: 'From:',date: `${result[0].Date}`},
        {title: 'To:',date: `${result[result.length-1].Date}`},
        {title: 'Aggregation:',date: `${aggregation}`},
        {title: 'Period:',date: `${period}`}
        ]
        const Report = [{title: "Report"}]
        const wscols = [
          {wch:25},
          {wch:30},
          {wch:30},
        ];
        const worksheet = XLSX.utils.json_to_sheet(result, {origin: 'A8'});
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        XLSX.utils.sheet_add_json(worksheet, header, {skipHeader: true, origin: 'A1'});
        XLSX.utils.sheet_add_json(worksheet, info, {skipHeader: true, origin: 'B3'});
        XLSX.utils.sheet_add_json(worksheet, Report, {skipHeader: true, origin: 'A3'});
        const merge = [
          { s: { r: 0, c: 0 }, e: { r: 1, c: 2 } },{ s: {r: 2, c: 0}, e: {r:5, c:0}}
        ];
        var cell = worksheet['A1'];
        var style = {
          font: { bold: true, name: "Arial", sz: 16, color: "black"},
          alignment: { horizontal: "center", vertical: "center" },
        };
        cell.s = style;
        var styleInfo = {
          font: {bold: true},
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" }
          }
        }
        var styleHeader = {
          font: { bold: true},
          fill: { type: "pattern", patternType: "solid", fgColor: { rgb: "00FFFF" } },
          alignment: { horizontal: "center" },
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" }
          }
        }
        var styleReport = {
          alignment: { horizontal: "center", vertical: "center" },
          font: { bold: true},
        }
        worksheet["A3"].s = styleReport;
        worksheet['B3'].s = styleInfo;
        worksheet['B4'].s = styleInfo;
        worksheet['B5'].s = styleInfo;
        worksheet['B6'].s = styleInfo;
        worksheet['A8'].s = styleHeader;
        worksheet['B8'].s = styleHeader;
        worksheet['C8'].s = styleHeader;
        
        worksheet["!merges"] = merge;
        worksheet['!cols'] = wscols;

        var range = XLSX.utils.decode_range("C3:C6");
        for (var row = range.s.r; row <= range.e.r; row++) {
            for (var col = range.s.c; col <= range.e.c; col++) {
                var cell = XLSX.utils.encode_cell({ r: row, c: col });
                var styleBorder = {
                  alignment: { horizontal: "right" },
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" }
                  }
                };
                worksheet[cell].s = styleBorder;
            }
        }

        var range = XLSX.utils.decode_range(`A9:C${result.length+9}`);
        for (var row = range.s.r; row <= range.e.r; row++) {
            for (var col = range.s.c; col <= range.e.c; col++) {
                var cell = XLSX.utils.encode_cell({ r: row, c: col });
                if (!worksheet[cell]) 
                  worksheet[cell] = { t: "z" };
                var styleTable = {
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" }
                  }
                };
                worksheet[cell].s = styleTable;
            }
        }
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const fileName = `${name}.xlsx`;
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
        saveAs(file, fileName);
    };

    const handleAddDashboard = (e) => {
        e.preventDefault();
        const dataPending = Promise.all(selectedOption.map((element)=>{
            return getData({variableId: element.varId, startDate: new Date(e.target.startDate.value).toISOString(), toDate: `${checked? new Date(Date.now()).toISOString(): new Date(e.target.toDate.value).toISOString()}`, aggregation: e.target.aggregation.value, period: e.target.period.value});
        }))
        const varName = selectedOption.map((element)=> element.label);
        dataPending
            .then((data) => {
                exportToExcel(e.target.filename.value, varName, data, e.target.aggregation.value, e.target.period.value)
            })
        
        
    }
    return (
    <div className="export-component" style={{}}>
    <Form onSubmit={(e)=>handleAddDashboard(e)}>
        <div className='add-dashboard-panel'>
                <h2> Setting </h2>
                <div className='content'>
                  <div className='dashboard-name-input'>
                    <div>File name:</div>
                    <Input placeholder="Ex: abc.xlsx" name="filename" required></Input>
                  </div>
                  <div className='dashboard-setting'>
                    <h4>Date settings</h4>
                    <div> Select variables or KPIs </div>
                    <Select
                    options={groupedOptions}
                    value={selectedOption}
                    onChange={handleChange}
                    isMulti
                    />
                    <div style={{display: 'flex', columnGap: '40px'}}>
                        <div className='time-range'>
                        <div>
                            Period:
                        </div>
                        <select type="period" name="period" required>
                            {period}
                        </select>
                        </div>

                        <div className='aggregation'>
                        <div>
                            Aggregation:
                        </div>
                        <select type="aggregation" name="aggregation" style={{width: '150px'}} required>
                            {aggregation}
                        </select>
                        </div>
                    </div>

                    <div style={{display: 'flex',alignItems: 'center'}}>
                      <div>
                        Date
                        </div>
                      (<div style={{fontSize: '10px', color: 'red', opacity: '0.8'}}>dd-mm-yyyy  hour:minute</div>)
                    </div>
                    <div className='date-setting'>
                      From:
                      <div>
                          <Flatpickr
                              name='startDate'
                              options={{
                                dateFormat: "m/d/Y, H:i" ,
                                maxDate: 'today',
                                enableTime: true,
                                defaultDate: `${today.toLocaleDateString()}`
                              }}
                              /> 
                    </div>
                      to:
                    <div>
                        <Flatpickr
                            disabled={checked}
                            name='toDate'
                            options={{
                                dateFormat: "m/d/Y, H:i" ,
                                maxDate: 'today',
                                enableTime: true,
                            }}
                            /> 
                      </div>
                      <div className='use-current-date-option' style={{display: 'flex', columnGap: '2px'}}>
                        <input type='checkbox' checked={checked} onClick={()=>setChecked(prev => !prev)}></input>
                        <div> now </div>
                    </div>           
                    </div>
                    <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <button className="export-data-button" >Export</button>
                    </div>
                  </div>
                </div>
        </div>
    </Form>
    </div>
    )
}
export default Export;