/*!
=========================================================
* Black Dashboard React v1.2.1
=========================================================
* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)
* Coded by Creative Tim
=========================================================
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import React, { useCallback, useState }from "react";
import { Input, Form } from "reactstrap";
import { useDrag, useDrop } from "react-dnd";
import { v4 as uuid } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select"
import axios from "axios";
import { useHistory } from "react-router-dom";
import { addKpi } from "store";



function AddKPI () {
    const history = useHistory();
    const dispatch = useDispatch();
    const _id = useSelector(state => state.auth.login.currentUser?._id);
    const [formula, setFormula] = useState([]);
    const initItem = [
      {
        operator: 'Param'
      },
      {
        operator: '+',
      },
      {
        operator: '-',
      },
      {
        operator: '*',
      },
      {
        operator: '/',
      },
      {
        operator: '+',
      },
      {
        operator: '(',
      },
      {
        operator: ')',
      }
    ]
    const [item, setItem] = useState(initItem)

    const varList = useSelector((state)=>state.getVariables);
    const varop = varList.map((element, i)=>{
      return {value: `${element.variableName}`, label: `${element.variableName}`, type:`VAR`, color: `#${Math.floor(Math.random()*16777215).toString(16)}`, dec: 2, alt: '', varId: `${element.variableId}`}
    });
    const handleChange = (e, id) => {
      const newFormula = formula.map((element) => {
        if ( element.id == id ) {
          // console.log({...element, label: e.label, varId: e.varId});
          return {...element, label: e.label, varId: e.varId}
        }
        else
          return element
      })
      setFormula(newFormula);
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

    const [{ isOver }, drop] = useDrop(() => ({
      accept: "operator",
      drop: (item) => handleAddOperator(item),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }));

    const handleAddOperator = (item) => {
      let id = uuid().slice(0,3);
      if (item.operator != "Param")
        setFormula(prev => [...prev, {id: id, type: 'operator', operator: item.operator}]);
      else  
        setFormula(prev => [...prev, {id: id, type: 'Param'}]);
    }

    const handleRemoveOperator = (id) => {
      const newFormula = formula.filter(e => (e.id != id));
      setFormula(newFormula);
    }

    const handleRename = (e, id) => {
      const newFormula = formula.map(element => {
        if (element.id == id)
          return {
            id: id, 
            type: 'Param', 
            text: e.target.value, 
            label: '',
            varId: '',
          }
        else
         return element
      });
      setFormula(newFormula);
    }

    const handleSaveKPI = async(e) => {
      e.preventDefault();
      let id = uuid().slice(0,8);
      console.log(formula);
      const newKPI = {
        _id: _id,
        kpi:[{
          id: id,
          name: e.target.kpiname.value,
          formula: formula,
          date: new Date(Date.now()).toLocaleString()
        }]
    }
    await axios.post("http://localhost:4000/user/addKPI", newKPI)
    dispatch(addKpi(newKPI.kpi[0]));
    history.push('/admin/kpis/list'); 
    }


    return (
    <div className="export-component" style={{}}>
    <Form onSubmit={(e) => handleSaveKPI(e)}>
        <div className='add-dashboard-panel'>
                <h2> Add new KPI instance </h2>
                <div className='content'>
                  <div className='dashboard-name-input'>
                    <div>KPIs name:</div>
                    <Input placeholder="Ex: KPI example..." name="kpiname" required></Input>
                  </div>
                  <div className='dashboard-setting'>
                    <h4>Formula:</h4>
                    <div className="formula">
                      
                      <div className="formula-header">
                        <div>1. Formula Editor</div>
                        <div style={{display: 'flex', columnGap: '2px'}}>
                          {
                            item.map((e,i) => (<Operator operator={e.operator} key={i}></Operator>))
                          } 
                        </div>
                      </div>
                      <div className="input-formula" style={{display: 'flex', columnGap: '2px'}} ref={drop}>
                        {
                          formula.map((e,i) => {
                          if (e.type != 'Param')
                            return (<OperatorBg operator={e.operator} id={e.id} handleRemoveOperator={handleRemoveOperator} key={i}></OperatorBg>)
                          else
                            return <InputBg 
                            text={e.text} 
                            id={e.id} 
                            handleRemoveOperator={handleRemoveOperator} 
                            handleChange={handleRename}
                            key={i} ></InputBg>
                          })
                        }
                      </div>
                      <div className="formula-header">
                          <div>2. Link variables:</div>
                          <div style={{display: 'flex', rowGap: '10px', fontWeight: '500', flexDirection: 'column'}}>
                            {
                              formula.map((e,i)=> {
                                if (e.type == 'Param')
                                  return <LinkTag 
                                  text={e.text} 
                                  id={e.id}
                                  groupedOptions={groupedOptions}
                                  handleChange={handleChange}
                                  ></LinkTag>
                              })
                            }                   
                          </div>
                      </div>
                    </div>

                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <button type="button" className="export-data-button" onClick={()=>history.push('/admin/kpis/list')} style={{background: 'gray'}}>Cancel</button>
                        <button className="export-data-button">Save</button>
                    </div>
                  </div>
                </div>
        </div>
    </Form>
    </div>
    )
}

function Operator ({ operator }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'operator',
    item: { operator: operator },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  const style = {
    padding: '4px 15px',
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
    minWidth: '43px',
    borderRadius: '5px',
    background: 'transparent',
    fontSize: '16px',
    position: 'relative',
    color: '#0043ff',
    border: '1px solid #0043ff',
    fontWeight: '300',
    cursor: 'pointer',
  }

  return (
    <div
      ref={drag}
      className={`operator ${isDragging ? "dragging" : ""}`}
      style={style}
    >{operator}</div>
  );
};

function OperatorBg ({operator, id, handleRemoveOperator}) {
  const style = {
    padding: '10px 15px',
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
    minWidth: '43px',
    borderRadius: '27px',
    background: 'white',
    fontSize: '16px',
    position: 'relative'
  }

  const styleIcon = {
    position: 'absolute',
    fontSize: '10px',
    top: '0',
    right: '0',
    background: 'red',
    borderRadius: '50%',
    padding: '2px',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
  }
  return (<div style={style}>
    <i className="tim-icons icon-simple-remove" style={styleIcon} onClick={e => handleRemoveOperator(id)}></i>
    {operator}
  </div>)
}

function InputBg ({text, id, handleRemoveOperator, handleChange}) {
  const style = {
    padding: '10px 15px',
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
    borderRadius: '27px',
    background: 'white',
    fontSize: '16px',
    position: 'relative', 
  }

  const styleIcon = {
    position: 'absolute',
    fontSize: '10px',
    top: '0',
    right: '0',
    background: 'red',
    borderRadius: '50%',
    padding: '2px',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
  }
  return (<div style={style}>
    <i className="tim-icons icon-simple-remove" style={styleIcon} onClick={e => handleRemoveOperator(id)}></i>
    <input value={text} style={{border: 'none'}} onChange={e => handleChange(e, id)}  placeholder='param...' required></input>
  </div>)
}

function LinkTag ({text, id, groupedOptions, handleChange}) {
  const [selectedOption, setSelectedOption] = React.useState(null);
  const style = {
    padding: '10px 15px',
    height: '100%',
    border: '1px solid #e3e3e3',
    border: '2px',
    background: 'white',
    fontSize: '16px',
    position: 'relative'
  }

  return (<div style={{display: 'flex', alignItems: 'center', columnGap: '10px'}}>
    <div style={style}>{text}</div>
    <i className="tim-icons icon-link-72" style={{fontSize: '20px'}}></i>
    <Select
      options={groupedOptions}
      value={selectedOption}
      onChange={e => {handleChange(e, id); setSelectedOption(e)}}
      required
    />
  </div>)
}



export default AddKPI;
