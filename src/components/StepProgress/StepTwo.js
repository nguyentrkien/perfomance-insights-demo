import React from 'react'
import { FormGroup, Input } from 'reactstrap'
import './Step.scss'

export default function StepTwo(props) {
  return (
    <div>
        <FormGroup>
          <div> 2. Details </div>
          <div> Widget name </div>
          <Input type='text' placeholder='Widget name' name='widgetName' value={props.form.widgetName} onChange={props.handleChange} required></Input>
          <div> Period: </div>
          <Input type='number'name='periodNum' value={props.form.periodNum} onChange={props.handleChange} required></Input>
          <select type='text' name='periodUnit' value={props.form.periodUnit} onChange={props.handleChange} required>
            <option value='Hour(s)'>Hour(s)</option>
            <option value='Second(s)'>Second(s)</option>
            <option value='Minute(s)'>Minute(s)</option>
          </select>
        </FormGroup>
    </div>
  )
}
