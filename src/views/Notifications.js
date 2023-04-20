/*!

=========================================================
* Black Dashboard React v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================.

*/
import React from "react";
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";

// reactstrap components
import {
  Alert,
  UncontrolledAlert,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col
} from "reactstrap";
import '../assets/scss/black-dashboard-react/custom/table.scss'
import { useDispatch, useSelector } from "react-redux";
import XLSX from 'sheetjs-style';
import { saveAs } from 'file-saver';
import ExportIcon from "../assets/img/exportIcon.png"
import { removeHistoryAlert } from "store";

function Notifications() {
  const dispatch = useDispatch();
  const data = useSelector(state => state.historyAlert);
  const handleExport = (datas) => {
    const data = datas.map(e => {return {
      Parameter: e.parameter,
      Type: e.type,
      Alert_Type: e.alertType,
      Value: e.value,
      Date: e.date,
    }})

    const header = [{title: 'THANH THIEN TECHNOLOGY JSC'}];
    const wscols = [
      {wch:25},
      {wch:10},
      {wch:10},
      {wch:10},
      {wch:20},
    ];
    const worksheet = XLSX.utils.json_to_sheet(data, {origin: 'A4'});
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    XLSX.utils.sheet_add_json(worksheet, header, {skipHeader: true, origin: 'A1'});
    const merge = [{ s: { r: 0, c: 0 }, e: { r: 1, c: 4 } }];
    var cell = worksheet['A1'];
    var style = {
      font: { bold: true, name: "Arial", sz: 16, color: "black"},
      alignment: { horizontal: "center", vertical: "center" },
    };
    cell.s = style;
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

    worksheet['A4'].s = styleHeader;
    worksheet['B4'].s = styleHeader;
    worksheet['C4'].s = styleHeader;
    worksheet['D4'].s = styleHeader;
    worksheet['E4'].s = styleHeader;
    
    worksheet["!merges"] = merge;
    worksheet['!cols'] = wscols;

    var range = XLSX.utils.decode_range(`A5:E${data.length+5}`);
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
              },
              alignment: { horizontal: "center" },
            };
            worksheet[cell].s = styleTable;
        }
    }

    var range = XLSX.utils.decode_range(`B5:B${data.length+5}`);
    for (var row = range.s.r; row <= range.e.r; row++) {
        for (var col = range.s.c; col <= range.e.c; col++) {
            var cell = XLSX.utils.encode_cell({ r: row, c: col });
            if (!worksheet[cell]) 
              worksheet[cell] = { t: "z" };
            var styleTable = {
              font: {
                color: { rgb: 'FF0000' },
                bold: true
              },
              border: {
                top: { style: "thin" },
                bottom: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" }
              },
              alignment: { horizontal: "center" },
            };
            worksheet[cell].s = styleTable;
        }
    }

    var range = XLSX.utils.decode_range(`C5:C${data.length+5}`);
    for (var row = range.s.r; row <= range.e.r; row++) {
        for (var col = range.s.c; col <= range.e.c; col++) {
            var cell = XLSX.utils.encode_cell({ r: row, c: col });
            if (!worksheet[cell]) 
              worksheet[cell] = { t: "z" };
            var styleTable = {
              font: {
                color: { rgb:  `${worksheet[cell].v == 'Warning'?'FFCC00':'FF0000'}` }
              },
              border: {
                top: { style: "thin" },
                bottom: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" }
              },
              alignment: { horizontal: "center" },
            };
            worksheet[cell].s = styleTable;
        }
    }
    var range = XLSX.utils.decode_range(`E5:E${data.length+5}`);
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
              },
              alignment: { horizontal: "right" },
            };
            worksheet[cell].s = styleTable;
        }
    }


    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileName = `Alert.xlsx`;
    const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    saveAs(file, fileName);
  };

  const handleDelete = (item) => {
    console.log(item)
    dispatch(removeHistoryAlert(item))
  }

  return (
    <div className="table">
      <img 
      src={ExportIcon} 
      style={{position: 'absolute', width: '2%', top: '44px', right: '10px', cursor: 'pointer'}}
      onClick={ e => handleExport(data)}
      ></img>
      <Table data={data} handleDelete={handleDelete}/>
    </div>
  );
}

function Table({data, handleDelete}) {
  return (
    <table>
      <thead>
        <tr>
          <th style={{textAlign: 'center'}}>Parameter</th>
          <th style={{textAlign: 'center'}}>Type</th>
          <th style={{textAlign: 'center'}}>Alert Type</th>
          <th style={{textAlign: 'center'}}>Value</th>
          <th style={{textAlign: 'center', width: '250px'}}>Date</th>
          <th style={{width: '100px'}}></th>
        </tr>
      </thead>
      <tbody>
        {data.length == 0
        ?<></>
        :
          data.map(item => (
          <tr key={item.id}>
            <td style={{textAlign: 'center'}}>{item.parameter}</td>
            <td style={{color: `${item.type == 'VAR'?'red':'green'}`, textAlign: 'center'}}>{item.type}</td>
            <td style={{color: `${item.alertType == 'Alert'?'red':'orange'}`, textAlign: 'center'}}>{item.alertType}</td>
            <td style={{textAlign: 'center'}}>{item.value}</td>
            <td style={{textAlign: 'right'}}>{item.date}</td>
            <td style={{cursor: 'pointer', textAlign: 'center', color: 'red'}} onClick={ e => handleDelete(item)}>Delete</td>
          </tr>
          ))
        }
      </tbody>
    </table>
  );
}

export default Notifications;
