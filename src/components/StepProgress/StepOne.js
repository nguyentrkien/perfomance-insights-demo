import React from 'react'
import { FormGroup, Button, CardImg } from 'reactstrap'
import GanttChartIcon from '../../assets/icon/gantt-chart.png'
import GaugeChartIcon from '../../assets/icon/gauge-chart.png'
import HeatmapIcon from '../../assets/icon/heatmap.png'
import LineGraphIcon from '../../assets/icon/line-graph.png'
import PieChartIcon from '../../assets/icon/pie-chart.png'
import './Step.scss'

export default function StepOne(props) {
  const [select, setSelect] = React.useState(props.form.widgetType)
  return (
    <>
        <FormGroup>
          <div> 1. Widget type: </div>
          <div> Select one of the widget types. </div>
          <div className='widgets'>
            <div className={`card-icon ${select == 'Diagram'? 'active': null}`} onClick={()=> {setSelect('Diagram'); props.handleSelectWidget('Diagram')}}>
              <CardImg top src={LineGraphIcon}></CardImg>
              <div>Diagram</div>
            </div>
            <div className={`card-icon ${select == 'Gantt'? 'active': null}`} onClick={()=> {setSelect('Gantt'); props.handleSelectWidget('Gantt')}}>
              <CardImg top src={GanttChartIcon}></CardImg>
              <div>Gantt</div>
            </div>
            <div className={`card-icon ${select == 'Gauge'? 'active': null}`} onClick={()=> {setSelect('Gauge'); props.handleSelectWidget('Gauge')}}>
              <CardImg top src={GaugeChartIcon}></CardImg>
              <div>Gauge</div>
            </div>
            <div className={`card-icon ${select == 'Heatmap'? 'active': null}`} onClick={()=> {setSelect('Heatmap'); props.handleSelectWidget('Heatmap')}}>
              <CardImg top src={HeatmapIcon}></CardImg>
              <div>Heatmap</div>
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
