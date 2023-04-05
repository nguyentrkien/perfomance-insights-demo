import React from 'react'
import { FormGroup, Input } from 'reactstrap'
import './Step.scss'

export default function StepFive(props) {
const parameter = props.form.parameter[0];
  return (
    <FormGroup>
        <div>5. {props.form.widgetType} Option</div>
        <div>Define the widget secific display options.</div>
        {parameter.set
            ? 
            <div className='card-param'>
              <div className='param-name'>{parameter.name}</div>
              <div className='param-type'>
                <div style={{fontSize: '10px',opacity: '0.7'}}>Type</div>
                <div className={parameter.type=='VAR'?'var':'kpi'}>
                  {parameter.type}</div>
                </div>
              <i className='tim-icons icon-settings-gear-63'></i>
            </div>
            : null
        }
        <div className='card-param'>
              <div className='param-name'>Y-axis</div>
              <i className='tim-icons icon-settings-gear-63'></i>
        </div>
        <div>Label</div>
        <Input type='text' name='yAxisLabel' value={props.form.yAxisLabel} onChange={props.handleChange}></Input>
    </FormGroup>
  )
}
