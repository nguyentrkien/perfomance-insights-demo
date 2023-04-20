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
import Draggable from 'react-draggable';


function KPIs () {
    const [checked, setChecked] = useState(true);

    return (
    <div className="export-component" style={{}}>
    <Form>
        <div className='add-dashboard-panel'>
                <h2> Add new KPI instance </h2>
                <div className='content'>
                  <div className='dashboard-name-input'>
                    <div>KPIs name:</div>
                    <Input placeholder="Ex: abc.xlsx" name="filename" required></Input>
                  </div>
                  <div className='dashboard-setting'>
                    <h4>Formula:</h4>
                    <div> Select variables or KPIs </div>
                    
                    <div className="formula">
                        <Draggable
                        bounds='parent'
                        >
                            <div>a</div>
                        </Draggable>
                        <div className="input-formula">

                        </div>
                    </div>

                    <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <button className="export-data-button" >Export</button>
                    </div>
                  </div>
                </div>
        </div>
    </Form>
    </div>
    )
}
export default KPIs;
