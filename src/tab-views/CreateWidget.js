import React from 'react'
import StepOne from 'components/StepProgress/StepOne';
import StepTwo from 'components/StepProgress/StepTwo';
import StepThree from 'components/StepProgress/StepThree';
import StepFour from 'components/StepProgress/StepFour';
import MultiStepProgress from 'components/StepProgress/MultiStepProgress/MultiStepProgress';
import { Form, Button } from 'reactstrap';
import StepFive from 'components/StepProgress/StepFive';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { addWidget } from 'store';
import { useDispatch } from 'react-redux';
import './CreateWidget.scss'


export default function CreateWidget({asset, id}) {
    const history = useHistory();
    const dispatch = useDispatch();
    const [page, setPage] = React.useState("pageone");
    const [form, setForm] = React.useState({
        widgetType: '',
        widgetName: '',
        periodNum: 1,
        periodUnit: 'Hour(s)',
        parameter: [{
            set: false,
            name: '',
            varId: '',
            type: ''
          }],
        multiSelect: [],
        alternativeLabel: '',
        decimalNumber: 2,
        color: '#03a9f4',
        lowlimitalert: '',
        lowlimitwarning: '',
        highlimitwarning: '',
        highlimitalert: '',
        yAxisLabel: '',
        UnitGauge: '',
        minRange: '',
        maxRange: '',
    });

    const nextPage = (pageNumber) => {
        setPage(pageNumber)
    };

    const prevPageStage = (page) => {
        switch(page){
            case 'pagetwo':
                setPage('pageone')
                break
            case 'pagethree':
                setPage('pagetwo')
                break
            case 'pagefour':
                setPage('pagethree')
                break
        }
    }

    const nextPageStage = (page) => {
        switch(page){
            case 'pageone':
                setPage('pagetwo')
                break
            case 'pagetwo':
                setPage('pagethree')
                break
            case 'pagethree':
                setPage('pagefour')
                break
        }
    }

    const handleChange = (e) => {
        let updateValue = {[e.target.name]: e.target.value}
        setForm(form => ({
            ...form,
            ...updateValue
        }))
    }

    const handleSelectWidget = (type) => {
        let updateValue = {widgetType: type}
        setForm(form => ({
            ...form,
            ...updateValue
        }))
    }

    const handleSelectColor = (value) => {
        let updateValue = {color: value}
        setForm(form => ({
            ...form,
            ...updateValue
        }))
    }

    const handleSelectParam = (set, type, name, varId) => {
        let updateValue = {parameter: [{
            set: set,
            name: name,
            varId: varId,
            type: type
          }]}
        setForm(form => ({
            ...form,
            ...updateValue
        }))
    }

    const handleMultiSelect = (selectedOption) => {
        console.log(selectedOption)
        setForm(form => ({
            ...form,
            multiSelect: selectedOption
        }))
    }

    const handleMultiChange = (e, index) => {
        const updateValue = form.multiSelect.map((element,i) => {
            if (i == index)
                return {...element,[e.target.name]: e.target.value} 
            else 
                return element
        })
        console.log(updateValue)
        setForm(form => ({
            ...form,
            multiSelect: updateValue
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`${form.widgetType},${asset},${id}`);
        dispatch(addWidget({
            asset: asset,
            id: id,
            widgetType: form.widgetType,
            widgetName: form.widgetName,
            periodNum: form.periodNum,
            periodUnit: form.periodUnit,
            parameter: form.parameter,
            multiSelect: form.multiSelect,
            alternativeLabel: form.alternativeLabel,
            decimalNumber: form.decimalNumber,
            color: form.color,
            lowlimitalert: form.lowlimitalert,
            lowlimitwarning: form.lowlimitwarning,
            highlimitwarning: form.highlimitwarning,
            highlimitalert: form.highlimitalert,
            yAxisLabel: form.yAxisLabel,
            width: `${{
                    "Diagram":'400',
                    "Pie": '245',
                    "Gauge": '295',

                }[form.widgetType]}`, 
            height: `${{
                "Diagram":'200',
                "Pie": '245',
                "Gauge": '210',
                }[form.widgetType]}`,
            lastX: '0',
            lastY: '0',
            ratio: 2,
            UnitGauge: form.UnitGauge,
            minRange: `${(form.minRange == '')?'0':form.minRange}`,
            maxRange: form.maxRange,
        }))
        history.push(`/admin/device/${asset}/dashboard/${id}`);
    }

  return (
    <div>
        <Form onSubmit={handleSubmit}>
            <MultiStepProgress page={page} onPageNumberClick={nextPage} />
            {
            {
                pageone: <StepOne handleSelectWidget={handleSelectWidget} form={form}/>,
                pagetwo: <StepTwo handleChange={handleChange} form={form}/>,
                pagethree: <StepThree handleSelect={handleSelectParam} handleMultiSelect={handleMultiSelect} form={form}/>,
                pagefour: <StepFour handleChange={handleChange} handleMultiChange={handleMultiChange} handleSelectColor={handleSelectColor} form={form}/>,
                }[page]
            }
            <div className='button-groups'>
                <button type="button" name='cancel' onClick={() => history.push(`/admin/device/${asset}/dashboard/${id}`)}> Cancel </button>
                <div className='button-end'>
                    {page != "pageone"
                    ? <button type="button" onClick={() => prevPageStage(page)}> 
                        <i className='tim-icons icon-minimal-left'></i>
                        Previous 
                    </button>
                    : null}
                    {page != "pagefour"
                    ? <button type="button" onClick={() => nextPageStage(page)}> 
                        Continue 
                        <i className='tim-icons icon-minimal-right'></i>
                    </button>
                    : null}
                    {page == "pagefour"
                    ? <button type='submit' onClick={handleSubmit}> Submit </button>
                    : null}
                </div>
            </div>
        </Form>
    </div>
  )
}
