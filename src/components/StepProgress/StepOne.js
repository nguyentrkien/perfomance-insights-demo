import React from 'react'
import { FormGroup, Button, CardImg } from 'reactstrap'
import GaugeChartIcon from '../../assets/icon/gauge-chart.png'
import LineGraphIcon from '../../assets/icon/line-graph.png'
import PieChartIcon from '../../assets/icon/pie-chart.png'
import './Step.scss'

export default function StepOne(props) {
  const [select, setSelect] = React.useState(props.form.widgetType)
  return (
    <>
        <FormGroup>
          <h3 className='step-header'> 1. Widget type: </h3>
          <div> Select one of the widget types. </div>
          <div className='widgets'>
            <div className={`card-icon ${select == 'Diagram'? 'active': null}`} onClick={()=> {setSelect('Diagram'); props.handleSelectWidget('Diagram')}}>
              <CardImg top src={LineGraphIcon}></CardImg>
              <div>Diagram</div>
            </div>
            <div className={`card-icon ${select == 'Gauge'? 'active': null}`} onClick={()=> {setSelect('Gauge'); props.handleSelectWidget('Gauge')}}>
              <CardImg top src={GaugeChartIcon}></CardImg>
              <div>Gauge</div>
            </div>
            <div className={`card-icon ${select == 'Pie'? 'active': null}`} onClick={()=> {setSelect('Pie'); props.handleSelectWidget('Pie')}}>
              <CardImg top src={PieChartIcon}></CardImg>
              <div>Pie</div>
            </div>
          </div>
        </FormGroup>
    </>
  )
}
