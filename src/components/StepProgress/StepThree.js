import React from 'react'
import { FormGroup, Input, Dropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap'
import { useSelector } from 'react-redux';
import Select, {components} from "react-select";

export default function StepThree(props) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [parameter, setParameter] = React.useState(props.form.parameter[0]);
  const varList = useSelector((state)=>state.getVariables);
  const varOptions = varList.map((element, i)=>{
      return <DropdownItem key={i} onClick = {() => {handleSetParameter(element, 'VAR')}}>{element.variableName}</DropdownItem>
    });

  const handleSetParameter = (element, type) => {
    props.handleSelect(true,type,element.variableName)
    setParameter({
      set: 'true',
      name: element.variableName,
      type: type,
    })
  }
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const handleClearParameter = () => {
    props.handleSelect(false,'','')
    setParameter({
      set: false,
      name: '',
      type: '',
    })
  }

  return (
    <div>
        <FormGroup>
            <div> 3. Parameters </div>
            <div> Select variable or KPI </div>
            {parameter.set
            ? 
            <div className='card-param'>
              <div className='param-name'>{parameter.name}</div>
              <div className='param-type'>
                <div style={{fontSize: '10px',opacity: '0.7'}}>Type</div>
                <div className={parameter.type=='VAR'?'var':'kpi'}>
                  {parameter.type}</div>
                </div>
              <i className='tim-icons icon-simple-remove' onClick={() => handleClearParameter()}></i>
            </div>
            : null
            }
            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle caret><i style={{rotate: '90deg'}} className='tim-icons icon-triangle-right-17'></i></DropdownToggle>
            <DropdownMenu>
              <DropdownItem header style={{color: 'red'}}>VAR</DropdownItem>
              {varOptions}
              <DropdownItem header style={{color: 'green'}}>KPI</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </FormGroup>
    </div>
  )
}
