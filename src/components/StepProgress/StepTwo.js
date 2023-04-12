import React from 'react'
import { FormGroup, Input } from 'reactstrap'
import './Step.scss'

export default function StepTwo(props) {
  return (
    <div>
        <FormGroup>
          <h3 className='step-header'> 2. Details: </h3>
          <div className='step-content'>
            <div className='widget-name'>
              <div className='bold'> Widget name </div>
              <Input type='text' placeholder='Widget name' name='widgetName' value={props.form.widgetName} onChange={props.handleChange} required></Input>
            </div>
            <div className='interval-timerange'>
              <div className='bold' style={{marginBottom: "10px"}}> Interval for time range: </div>
              <div> Calculation period: </div>
              <div className='period'>
                <Input type='number'name='periodNum' value={props.form.periodNum} onChange={props.handleChange} required></Input>
                <select type='text' name='periodUnit' value={props.form.periodUnit} onChange={props.handleChange} required>
                  <option value='Hour(s)'>Hour(s)</option>
                  <option value='Second(s)'>Second(s)</option>
                  <option value='Minute(s)'>Minute(s)</option>
                </select>
              </div>
            </div>
          </div>
        </FormGroup>
    </div>
  )
}
