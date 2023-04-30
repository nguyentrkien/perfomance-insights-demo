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
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Route, Switch, useHistory } from "react-router-dom";
import AddKPI from "tab-views/AddKPI";
import { removeKpi } from "store";

function KPIs_list () {
    const dispatch = useDispatch();
    const _id = useSelector(state => state.auth.login.currentUser?._id);
    const data = useSelector(state => state.auth.login.currentUser?.kpis);
    const history = useHistory();
    const handleDelete = async (item) => {
        await axios.post('http://localhost:4000/user/deleteKPI',{
          _id: _id,
          id: item.id
        })
        dispatch(removeKpi(item))
    }
    
    return (
        <div className="export-component">
            <div className='add-dashboard-panel'>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 40px 0'}}>
                    <h2 style={{margin: '0'}}> KPI List </h2>
                    <button 
                    onClick={()=> history.push(`/admin/kpis/add`)}
                    style={{border: 'none', borderRadius: '3px', padding: '5px 10px', background: '#2c68f5c7',color: 'white'}}
                    >
                        <i className="tim-icons icon-simple-add"></i>
                    </button>
                </div>
                <div className="kpi-table">
                <Table data={data} handleDelete={handleDelete}/>
                </div>
            </div>
        </div>
    );
}
    
function Table({data, handleDelete}) {
    return (
      <>
      {data?.length == 0
      ?<h4> No kpi has been created yet. </h4>
      :<table>
          <thead>
            <tr>
              <th style={{textAlign: 'center', width: '200px'}}>Name</th>
              <th style={{textAlign: 'center'}}>Formula</th>
              <th style={{textAlign: 'center', width: '200px'}}>Creation date</th>
              <th style={{width: '50px'}}></th>
            </tr>
          </thead>
          <tbody>
              {data.map(item => (
              <tr key={item.id}>
                <td style={{textAlign: 'center'}}>{item.name}</td>
                <td style={{textAlign: 'center'}}> 
                  {item.formula.reduce((chain, current)=> {
                    if (current.type == 'operator')
                      return chain + current.operator
                    else if (current.type == 'Param')
                      return chain + current.text
                  },'')}
                </td>
                <td style={{textAlign: 'center'}}>{item.date}</td>
                <td style={{cursor: 'pointer', textAlign: 'center', color: 'red'}} onClick={ e => handleDelete(item)}>
                  <i className="tim-icons icon-simple-remove"></i>
                </td>
              </tr>
              ))}
          </tbody>
        </table>
        }
      </>
      );
    }
    

export default KPIs_list;
