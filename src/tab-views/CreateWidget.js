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
            type: ''
          }],
        alternativeLabel: '',
        decimalNumber: 2,
        color: '#03a9f4',
        lowlimitalert: '',
        lowlimitwarning: '',
        highlimitwarning: '',
        highlimitalert: '',
        yAxisLabel: '',
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
            case 'pagefive':
                setPage('pagefour')
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
            case 'pagefour':
                setPage('pagefive')
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

    const handleSelectParam = (set, type, name) => {
        let updateValue = {parameter: [{
            set: set,
            name: name,
            type: type
          }]}
        setForm(form => ({
            ...form,
            ...updateValue
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`${form.widgetType},${form.widget},${form.name}`);
        dispatch(addWidget({
            asset: asset,
            id: id,
            widgetType: form.widgetType,
            widgetName: form.widgetName,
            periodNum: form.periodNum,
            periodUnit: form.periodUnit,
            parameter: form.parameter,
            alternativeLabel: form.alternativeLabel,
            decimalNumber: form.decimalNumber,
            color: form.color,
            lowlimitalert: form.lowlimitalert,
            lowlimitwarning: form.lowlimitwarning,
            highlimitwarning: form.highlimitalert,
            highlimitalert: form.highlimitwarning,
            yAxisLabel: form.yAxisLabel,
            width: '400', 
            height: '200',
            lastX: '0',
            lastY: '0',
            ratio: 3.5,
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
                pagethree: <StepThree handleSelect={handleSelectParam} form={form}/>,
                pagefour: <StepFour handleChange={handleChange} handleSelectColor={handleSelectColor} form={form}/>,
                pagefive: <StepFive handleChange={handleChange} handleSelectColor={handleSelectColor} form={form}/>,
                }[page]
            }
            {page != "pageone"
            ? <Button type="button" color="secondary float-left" onClick={() => prevPageStage(page)}> Previous </Button>
            : null}
            {page != "pagefive"
            ? <Button type="button" color="secondary float-left" onClick={() => nextPageStage(page)}> Next </Button>
            : null}
            {page == "pagefive"
            ? <Button type='submit' color="secondary float-left" onClick={handleSubmit}> Submit </Button>
            : null
            }
        </Form>
    </div>
  )
}
