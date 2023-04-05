import React from 'react'
import { Row, Col, Card, CardBody, CardTitle, CardHeader, Input, Progress, Form } from 'reactstrap'
import { useSelector, useDispatch } from 'react-redux';


export default function Alarm({notify}) {
  const varList = useSelector((state)=>state.getVariables);
  const cardAlarm = varList.map((element, i)=>{
    return (<CardAlarm element={element} notify={notify} key={i}></CardAlarm>)
  });
  console.log(varList);
  return (
  <> 
    {cardAlarm}
  </>
  )
}

function CardAlarm({element, notify}) {
  // const {dispatch: dispatchVar} = React.useContext(varContext);
  const [show, setShow] = React.useState(false);
  const handleSubmit = (e) =>{
    e.preventDefault();
    if((e.target.highlimitalert.value>e.target.highlimitwarning.value) &&
      (e.target.highlimitwarning.value>e.target.lowlimitwarning.value) &&
      (e.target.lowlimitwarning.value>e.target.lowlimitalert.value))
      {
        notify("success","Save Change");
        // dispatchVar({type: 'ALARM', 
        // payload: {name: `${element.name}`,
        // id: element.id,
        // alarm: e.target.alarm.checked,
        // LowLimitAlert: e.target.lowlimitalert.value, 
        // LowLimitWarning: e.target.lowlimitwarning.value,
        // HighLimitWarning: e.target.highlimitwarning.value,
        // HighLimitAlert: e.target.highlimitalert.value,
        // email: e.target.email.value}});
        // setShow(false);
      }
    else {
      notify("danger","Invalid input");
    }
  }
  return(
    <Form onSubmit={(e)=>handleSubmit(e)}>
      <Row>
      <Col xs="12">
            <Card className={show? "show" : "unshow"}>
              <CardHeader>
                <Row>
                <CardTitle tag="h2">
                  Setting Alarm for 
                  <div style={{color: 'red',display: 'inline-block', paddingLeft: '5px'}}>
                    {element.variableName} 
                  </div>
                </CardTitle>
                </Row>
                <i type="button" className="tim-icons icon-minimal-down" onClick={()=>{setShow(!show); return false}}></i>
              </CardHeader>
              <CardBody>
                <Row>
                <Col className="text-left" sm="6">
                  <div className="select_button">
                    <div>Limits:</div>
                  </div> 
                </Col>
                </Row>
                <Row>
                  <div className="limit_values">
                    <div className="input_limit_value">
                      <div>Low limit alert:</div>
                      <input type="number" step="0.01" name='lowlimitalert' value={element.alarm?element.LowLimitAlert:null} required ></input>
                    </div> 
                    <div className="input_limit_value">
                      <div>Low limit warning:</div>
                      <input type="number" step="0.01" name='lowlimitwarning' value={element.alarm?element.LowLimitWarning:null} required></input>
                    </div> 
                    <div className="input_limit_value">
                      <div>High limit warning:</div>
                      <input type="number" step="0.01" name='highlimitwarning' value={element.alarm?element.HighLimitWarning:null} required></input>
                    </div> 
                    <div className="input_limit_value">
                      <div>High limit alert:</div>
                      <input type="number" step="0.01" name='highlimitalert' value={element.alarm?element.HighLimitAlert:null} required></input>
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
                <Row>
                  <Col className="text-left" sm="6">
                    <div className="email_button">
                      <div>Email:</div>
                      <input placeholder={element.email?element.email:'Email...'} type="email" name="email" required></input>
                      <input type="checkbox" name="alarm"></input>
                      <div>Alarm</div>
                    </div> 
                  </Col>
                </Row>
                <button type='submit' className="create_chart">Save</button>
              </CardBody>
            </Card>
        </Col>
      </Row>
    </Form>
  )
}
