import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Row, Col, Input, CardHeader, Card } from 'reactstrap'
import { addDashboard, deleteDashboard } from 'store'
import { v4 as uuid } from 'uuid';
import DatePicker from 'react-datepicker'
import TimePicker from 'react-time-picker'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import "flatpickr/dist/flatpickr.css";
import Flatpickr from "react-flatpickr";
import './Dashboard.scss'
import axios from 'axios';

export default React.memo(function CreateDashboard({asset, assetId}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const timeRangeList = useSelector(state => state.timerange);
    const [checked, setChecked] = useState(true);
    const timeRange = timeRangeList.map((element, index) => {
        return <option value={element} key={index}>{element}</option>
      });
      
    const today = new Date();
    const handleAddDashboard = async (e) => {
        e.preventDefault();
        let id = uuid().slice(0,8);
        const newDashboard = {
          _id: assetId,
          dashboards:[{
              name: e.target.name.value,type: 'dashboard', 
              timerange: e.target.timerange.value, 
              startDate: new Date(e.target.startDate.value).toISOString(), 
              toDate: `${checked? new Date(Date.now()).toISOString(): new Date(e.target.toDate.value).toISOString()}`, 
              now: checked,
              id: id, 
              asset: asset
          }]
        }
        await axios.post("http://localhost:4000/user/updateUser", newDashboard)
        dispatch(addDashboard(newDashboard.dashboards[0]));
        history.push(`/admin/device/${asset}/dashboard/${id}`);
    }
    return (
    <>
    <Form onSubmit={(e)=>handleAddDashboard(e)}>
      <div className='add-dashboard-panel'>
                <h2> Add Dashboard </h2>
                <div className='content'>
                  <div className='dashboard-name-input'>
                    <div>Dashboard name:</div>
                    <Input placeholder="Dashboard name ..." name="name" required></Input>
                  </div>
                  <div className='dashboard-setting'>
                    <h4>Date settings</h4>
                    <div className='time-range'>
                      <div>
                        Time range:
                      </div>
                      <select type="timerange" name="timerange" required>
                        {timeRange}
                      </select>
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
                  </div>
                </div>
              <button type='button' className="cancel-dashboard-button" onClick={()=>history.push(`/admin/device/${asset}/dashboard/overview`)}>Cancel</button>
              <button className="create-dashboard-button">Create</button>
      </div>
    </Form>
    </>
  )
})
