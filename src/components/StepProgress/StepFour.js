import React from 'react'
import { FormGroup, Row, Col, Input, Dropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap'
import { CirclePicker } from 'react-color';
import {Progress} from 'reactstrap';
import Switch from '@mui/material/Switch';
import './Step.scss'

export default function StepFour(props) {
  const parameter = props.form.parameter[0];
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [dropdownOpenList, setDropdownOpenList] = React.useState([false, false]);
  const [isChecked, setIsChecked] = React.useState(false);

  const handleChange = (event) => {
    setIsChecked(event.target.checked);
    console.log(isChecked);
  };
  const [color, setColor] = React.useState(props.form.color)
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const handleChangeComplete = (e) => {
    props.handleSelectColor(e.hex);
    setColor(e.hex);
    toggle();
  };

  const list = props.form.multiSelect.map((element, index) => {
    return (
      <div className='step-content'>
          <div className='card-param' key={index}>
              <div className='param-name'>{element.value}</div>
              <div className='param-type'>
                <div style={{fontSize: '10px',opacity: '0.7'}}>Type</div>
                <div className={element.type=='VAR'?'var':'kpi'}>
                  {element.type}</div>
                </div>
              <i className='tim-icons icon-settings-gear-63'></i>
          </div>
          <div className='pattern'>
            <div className='flex-3'>
              <div className='item'>
                <div className='bold'> Alternative label </div>
                <Input type='text' name='alt' value={element.alt} onChange={(e)=>props.handleMultiChange(e,index)} required></Input>
              </div>

              <div className='item'>
                <div className='bold'>Decimal places</div>
                <Input min='0' type='number' name='dec' value={element.dec} onChange={(e)=>props.handleMultiChange(e,index)} required></Input>
              </div>

              <div className='item'>
                <div className='bold'>Color </div>
                <Dropdown isOpen={dropdownOpenList[index]} toggle={()=>alert('Select color feature coming soon...')}>
                  <DropdownToggle className='pick-color' caret><div className='circle-color' style={{background: `${element.color}`}}></div></DropdownToggle>
                  <DropdownMenu>
                    <CirclePicker name='color' onChangeComplete={(e)=>props.handleMultiChange(e,index)} >
                    </CirclePicker>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>

          </div>
        </div>
    )
  })

  return (
    <>
    {
      {
        "Diagram":
        <FormGroup>
        <h3 className='step-header'> 4. Display Option: </h3>
        <div>Define the general display options for the selected parameter</div>
        <div className='step-content'>
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
          <div className='pattern'>
            <div className='flex-3'>
              <div className='item'>
                <div className='bold'> Alternative label </div>
                <Input type='text' name='alternativeLabel' value={props.form.alternativeLabel} onChange={props.handleChange} required></Input>
              </div>

              <div className='item'>
                <div className='bold'>Decimal places</div>
                <Input min='0' type='number' name='decimalNumber' value={props.form.decimalNumber} onChange={props.handleChange} required></Input>
              </div>

              <div className='item'>
                <div className='bold'>Color </div>
                <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                  <DropdownToggle className='pick-color' caret><div className='circle-color' style={{background: `${color}`}}></div></DropdownToggle>
                  <DropdownMenu>
                    <CirclePicker name='color' onChangeComplete={handleChangeComplete} >
                    </CirclePicker>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>

            <div className='warning-setting'>
              <div className='bold' style={{margin: '0 20px'}}>Warning
                <Switch
                  checked={isChecked}
                  onChange={handleChange}
                />
              </div>
              {isChecked
              ?<div>
                <Row>
                    <div className="limit_values">
                      <div className="input_limit_value">
                        <div>Low limit alert:</div>
                        <Input type="number" step="0.01" name='lowlimitalert' value={props.form.lowlimitalert} onChange={props.handleChange} required ></Input>
                      </div> 
                      <div className="input_limit_value">
                        <div>Low limit warning:</div>
                        <Input type="number" step="0.01" name='lowlimitwarning' value={props.form.lowlimitwarning} onChange={props.handleChange} required></Input>
                      </div> 
                      <div className="input_limit_value">
                        <div>High limit warning:</div>
                        <Input type="number" step="0.01" name='highlimitwarning' value={props.form.highlimitwarning} onChange={props.handleChange} required></Input>
                      </div> 
                      <div className="input_limit_value">
                        <div>High limit alert:</div>
                        <Input type="number" step="0.01" name='highlimitalert' value={props.form.highlimitalert} onChange={props.handleChange} required></Input>
                      </div> 
                    </div>
                </Row>
                <Row>
                  <Progress multi>
                          <Progress bar color="danger" value="20">Alert</Progress>
                          <Progress bar color="warning" value="20">Warning</Progress>
                          <Progress bar color="white" value="20" style={{color: "black"}}>OK</Progress>
                          <Progress bar color="warning" value="20">Warning</Progress>
                          <Progress bar color="danger" value="20">Alert</Progress>
                  </Progress>
                </Row>
              </div>
              :<></>}
            </div>
          </div>
          <div className='card-param'>
            <div className='param-name'>Y-axis</div>
          </div>
          <div className='pattern'>
            <div className='yLabel'>
              <div className='bold'>Label</div>
              <Input type='text' name='yAxisLabel' placeholder="default" value={props.form.yAxisLabel} onChange={props.handleChange} required></Input>
            </div>
          </div>
        </div>
        </FormGroup>,
        "Pie": 
        <FormGroup>
        <h3 className='step-header'> 4. Display Option: </h3>
        <div>Define the general display options for the selected parameter</div>
        {list}
        </FormGroup>,
        "Gauge":
        <FormGroup>
        <h3 className='step-header'> 4. Display Option: </h3>
        <div>Define the general display options for the selected parameter</div>
        <div className='step-content'>
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
          <div className='pattern'>
            <div className='flex-3'>
              <div className='item'>
                <div className='bold'> Unit </div>
                <Input type='text' name='UnitGauge' value={props.form.UnitGauge} onChange={props.handleChange} required></Input>
              </div>

              <div className='item'>
                <div className='bold'>Decimal places</div>
                <Input min='0' type='number' name='decimalNumber' value={props.form.decimalNumber} onChange={props.handleChange} required></Input>
              </div>

              <div className='item'>
                <div className='bold'>Color </div>
                <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                  <DropdownToggle className='pick-color' caret><div className='circle-color' style={{background: `${color}`}}></div></DropdownToggle>
                  <DropdownMenu>
                    <CirclePicker name='color' onChangeComplete={handleChangeComplete} >
                    </CirclePicker>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>

            <div className='warning-setting'>
              <div className='bold'>Warning: </div>
              <Row>
                  <div className="limit_values" style={{margin: '0px'}}>
                  <div className="input_limit_value">
                      <div>Min Range:</div>
                      <Input type="number" step="0.01" name='minRange' value={props.form.minRange} onChange={props.handleChange} required></Input>
                    </div> 
                    <div className="input_limit_value">
                      <div>Low limit alert:</div>
                      <Input type="number" step="0.01" name='lowlimitalert' value={props.form.lowlimitalert} onChange={props.handleChange} required ></Input>
                    </div> 
                    <div className="input_limit_value">
                      <div>Low limit warning:</div>
                      <Input type="number" step="0.01" name='lowlimitwarning' value={props.form.lowlimitwarning} onChange={props.handleChange} required></Input>
                    </div> 
                    <div className="input_limit_value">
                      <div>High limit warning:</div>
                      <Input type="number" step="0.01" name='highlimitwarning' value={props.form.highlimitwarning} onChange={props.handleChange} required></Input>
                    </div> 
                    <div className="input_limit_value">
                      <div>High limit alert:</div>
                      <Input type="number" step="0.01" name='highlimitalert' value={props.form.highlimitalert} onChange={props.handleChange} required></Input>
                    </div> 
                    <div className="input_limit_value">
                      <div>Max Range:</div>
                      <Input type="number" step="0.01" name='maxRange' value={props.form.maxRange} onChange={props.handleChange} required></Input>
                    </div> 
                  </div>
              </Row>
              <Row>
                <Progress multi style={{margin: '2px 90px 20px 90px'}}>
                        <Progress bar color="danger" value="20">Alert</Progress>
                        <Progress bar color="warning" value="20">Warning</Progress>
                        <Progress bar color="white" value="20" style={{color: "black"}}>OK</Progress>
                        <Progress bar color="warning" value="20">Warning</Progress>
                        <Progress bar color="danger" value="20">Alert</Progress>
                </Progress>
              </Row>
            </div>
          </div>
        </div>
        </FormGroup>

      }[props.form.widgetType]
    }
    </>
  )
}



