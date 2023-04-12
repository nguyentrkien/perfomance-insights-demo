import React from 'react'
import './Dashboard.scss'

export default function OverviewPanel({NavigateCreateDashboard}) {

    return (
    <div className='overview-panel'>
        <i className='tim-icons icon-tv-2'></i>
        <h4>No dashboard has been created yet.</h4>
        <button className="create_chart_button" onClick={NavigateCreateDashboard}>
          <i className="tim-icons icon-simple-add"></i>
          <div>Create new dashboard</div>
        </button>
    </div>
  )
}