import React from 'react'
import { FormGroup, Row, Col, Input, Dropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap'
import { CirclePicker } from 'react-color';
import {Progress} from 'reactstrap';
import './Step.scss'

export default function StepFour(props) {
  const parameter = props.form.parameter[0];
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [color, setColor] = React.useState(props.form.color)
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const handleChangeComplete = (e) => {
    props.handleSelectColor(e.hex);
    setColor(e.hex);
    toggle();
  };
  return (
      <FormGroup>
        <div>4. Display Option</div>
        <div>Define the general display options for the selected parameter</div>
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
          <div> Alternative label </div>
          <Input type='text' name='alternativeLabel' value={props.form.alternativeLabel} onChange={props.handleChange}></Input>
          <div>Decimal places</div>
          <Input min='0' type='number' name='decimalNumber' value={props.form.decimalNumber} onChange={props.handleChange}  required></Input>
          <div>Color </div>
          <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle caret><div className='circle-color' style={{background: `${color}`}}></div></DropdownToggle>
            <DropdownMenu>
              <CirclePicker name='color' onChangeComplete={handleChangeComplete} >
              </CirclePicker>
            </DropdownMenu>
          </Dropdown>
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
      </FormGroup>
  )
}
