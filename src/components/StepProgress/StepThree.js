import React from 'react'
import { FormGroup, Input, Dropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap'
import { useSelector } from 'react-redux';
import Select, {components} from "react-select";

export default function StepThree(props) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [parameter, setParameter] = React.useState(props.form.parameter[0]);
  const [selectedOption, setSelectedOption] = React.useState(props.form.multiSelect)
  const varList = useSelector((state)=>state.getVariables);
  const varOptions = varList.map((element, i)=>{
      return <DropdownItem key={i} onClick = {() => {handleSetParameter(element, 'VAR')}}>{element.variableName}</DropdownItem>
  });

  const kpiList = useSelector((state)=>state.auth.login.currentUser?.kpis);
  const kpiOptions = kpiList.map((element, i)=>{
      return <DropdownItem key={i} onClick = {() => {handleSetParameter(element, 'KPI')}}>{element.name}</DropdownItem>
  });
  
  const handleSetParameter = (element, type) => {
    if (type == 'VAR')
    {
      setParameter({
        set: 'true',
        name: element.variableName,
        type: type,
      })
      props.handleSelect(true,type,element.variableName, element.variableId)
    }
    else if (type == 'KPI')
    {
      setParameter({
        set: 'true',
        name: element.name,
        type: type,
      })
      const listVar = element.formula.filter((e)=> {
        if (e.type == 'Param')
          return e.varId
      })
      const formula = element.formula.reduce((chain, current)=> {
        if (current.type == 'operator')
          return chain + current.operator
        else if (current.type == 'Param')
          return chain + current.text
      },'')
      props.handleSelect(true,type,element.name, listVar, formula)
      console.log(formula)
    }

  }
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  
  const handleClearParameter = () => {
    props.handleSelect(false,'','','')
    setParameter({
      set: false,
      name: '',
      type: '',
    })
  }
  
  const varop = varList.map((element, i)=>{
    return {value: `${element.variableName}`, label: `${element.variableName}`, type:`VAR`, color: `#${Math.floor(Math.random()*16777215).toString(16)}`, dec: 2, alt: '', varId: `${element.variableId}`}
  });

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    props.handleMultiSelect(selectedOption)
  };

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

  return (
    <div>
      {
        (props.form.widgetType == "Diagram" || props.form.widgetType == "Gauge")
        ?
        <FormGroup>
            <h3 className='step-header'> 3. Parameters: </h3>
            <div className='step-content'>

            <div style={{display: "flex", alignItems: "center", columnGap: "5px"}}>
              <div> Select variable or KPI </div>
                <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                <DropdownToggle caret><i style={{rotate: '90deg'}} className='tim-icons icon-triangle-right-17'></i></DropdownToggle>
                <DropdownMenu>
                  <DropdownItem header style={{color: 'red'}}>VAR</DropdownItem>
                    {varOptions}
                  <DropdownItem header style={{color: 'green'}}>KPI</DropdownItem>
                    {kpiOptions}
                </DropdownMenu>
                </Dropdown>
            </div>
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
            </div>
        </FormGroup>
        :<FormGroup>
            <h3 className='step-header'> 3. Parameters: </h3>
            <div className='step-content'>
            <div> Select at least 2 variables or KPIs </div>
            <Select
              options={groupedOptions}
              value={selectedOption}
              onChange={handleChange}
              isMulti
            />
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
            </div>
        </FormGroup>
        }
    </div>
  )
}
