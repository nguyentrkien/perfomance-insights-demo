import React, { useEffect } from 'react'
import { chartContext } from "layouts/Admin/Admin";
import { Form, Row, Col, Card, CardBody, CardHeader, Input, CardTitle } from 'reactstrap';
import Test from "variables/Test";
import { useSelector } from 'react-redux';


export default function OverviewPanel({notify}) {
    const [showCreateNewChart, setShowCreateNewChart] = React.useState(false);
    const {chartList, dispatch: dispatchChart} = React.useContext(chartContext);
    const varList = useSelector((state)=>state.getVariables);
    const chart = chartList.map((chart,index) =>{
      return(
        <Chart chart={chart} notify={notify} key={index}></Chart>
        )
    })
    const periodList = [{name: "second", id: 0},{name: "minute", id: 1},{name: "hour", id: 2}];
    const varOptions = varList.map((element, i)=>{
      return <option value={element.variableName} key={i}>{element.variableName}</option>
    });
    const periodOptions = periodList.map((element, i)=>{
      if (i == 0)
          return <option value={element.name} key={element.id} selected>{element.name}</option>
      else 
          return <option value={element.name} key={element.id} >{element.name}</option>
    });
    const handleCreateChart = (e) =>{
      e.preventDefault();
      notify("success", `Create chart ${e.target.name.value} successfully`)
      dispatchChart({type: 'ADD', payload: {name: `${e.target.name.value}`,variable: `${e.target.var.value}`,period: `${e.target.period.value}`}})
      setShowCreateNewChart(false);
    }
    useEffect(()=>{
      // dispatchVar({type: 'ADD', payload: {name: `var1`,id: 1,alarm: false}});
      // dispatchVar({type: 'ADD', payload: {name: `var2`,id: 2,alarm: false}});
    },[])
    return (
      <>
      <button className="create_chart_button" onClick={()=> setShowCreateNewChart(true)}>
          <i className="tim-icons icon-simple-add"></i>
          <div>Create new chart</div>
        </button>
        {showCreateNewChart
        ?<Form onSubmit={(e)=>handleCreateChart(e)}>
        <Row>
          <Col xs="12">
            <Card className="card-chart">
              <CardHeader>
                <Row>
                  <Input placeholder="Chart name ..." name="name" required></Input>
                </Row>
                <i className="tim-icons icon-simple-remove" onClick={()=> setShowCreateNewChart(false)}></i>
                <Row>
                  <Col className="text-left" sm="6">
                    <div className="select_button">
                      <div>Select Parameters:</div>
                      <select type="chart_var" name="var" required>
                        {varOptions} 
                      </select>
                      <div>Period:</div>
                      <select type="chart_period" name="period" required>
                        {periodOptions} 
                      </select>
                    </div> 
                  </Col>
                <button className="create_chart">Create</button>
                </Row>
              </CardHeader>
            </Card>
          </Col>
          </Row>
        </Form>
        :<></>
        }
        <div className="charts">
          {chart}
        </div>
    </>
  )
}

function Chart({chart, notify}) {
    const {dispatch} = React.useContext(chartContext);
    const handleRemoveChart = (chart) => 
    {
      dispatch({type: 'DELETE', payload: {name: `${chart.name}`,variable: `${chart.variable}`,period: `${chart.period}`}})
    }
    return(
      <Row>
            <Col xs="12">
              <Card className="card-chart">
                <CardHeader>
                  <Row>
                    <Col className="text-left" sm="6">
                      <h5 className="card-category">Chart</h5>
                      <CardTitle tag="h2">{chart.name}</CardTitle>
                    </Col>
                  </Row>
                  <i className="tim-icons icon-basket-simple" onClick={(e)=>{handleRemoveChart(chart); notify("info", `Chart ${chart.name} has been removed`)}}></i>
                  <Row>
                    <Col className="text-left" sm="6">
                      <div className="select_button">
                        <div>Parameters:</div>
                        <div id="var">
                          {chart.variable} 
                        </div>
                        <div>Period:</div>
                        <div id="period">
                          {chart.period} 
                        </div>
                      </div> 
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Test varSelect={chart.variable} notify={notify} period={chart.period}/>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
    )
  }
