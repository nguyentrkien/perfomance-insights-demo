import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Row, Col, Input, CardHeader, Card } from 'reactstrap'
import { addDashboard, deleteDashboard } from 'store'
import { v4 as uuid } from 'uuid';
import DatePicker from 'react-datepicker'
import TimePicker from 'react-time-picker'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

export default function CreateDashboard({asset}) {
    const dispatch = useDispatch();
    const history = useHistory();
    const timeRangeList = useSelector(state => state.timerange);
    const dashboards = useSelector(state => state.dashboards);
    const [startDate, setStartDate] = React.useState(new Date());
    const [time, setTime] = React.useState('10:00');
    const timeRange = timeRangeList.map((element, index) => {
        return <option value={element} key={index}>{element}</option>
    });
    const handleAddDashboard = (e) => {
        e.preventDefault();
        let id = uuid().slice(0,8);
        dispatch(addDashboard({name: e.target.name.value,type: 'dashboard', 
          timerange: e.target.timerange.value, 
          startDate: new Date(startDate).toISOString().split('T'), startTime: time, id: id, asset: asset}));
        history.push(`/admin/device/${asset}/dashboard/${id}`);

    }
    return (
    <>
    <Form onSubmit={(e)=>handleAddDashboard(e)}>
        <Row>
          <Col xs="12">
            <Card>
              <CardHeader>
                <Row>
                  <div> Add Dashboard </div>
                  <Input placeholder="Dashboard name ..." name="name" required></Input>
                </Row>
                <i className="tim-icons icon-simple-remove"></i>
                <Row>
                  <Col className="text-left" sm="6">
                    <div className="select_button">
                      <div>Time range:</div>
                      <select type="timerange" name="timerange" required>
                        {timeRange}
                      </select>
                      <div>Date(from):</div>
                      <DatePicker
                        showIcon
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                      />      
                      <TimePicker label="Controlled picker" onChange={(time)=> setTime(time)} value={time}/>                
                      <input type='checkbox'></input>
                      <div> use current date </div>
                    </div> 
                  </Col>
                <button className="create_chart">Create</button>
                </Row>
              </CardHeader>
            </Card>
          </Col>
          </Row>
        </Form>
    </>
  )
}
