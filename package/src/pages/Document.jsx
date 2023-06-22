import React from 'react'
import SettingKyc from "../assets/json/SettingKyc.json"

let StateData = SettingKyc.StateData
const Document = ({ inputJson, inputName, inputLable, placeholder, type, handleChange }) => {
    let { errors, touched, setFieldValue,TypeItem,currentDoc } = inputJson;
    const InputHandler = (e) => {
        let id = (e.target.id);
        let value = e.target.value
        setFieldValue(id, value)


    }
   
    return (
        <>
            {type == "input" && <>
                <label className="mb-2">{inputLable}</label>
                <input type="text" className="form-control" placeholder={placeholder}
                    name={inputName}
                    id={inputName}
                    onPaste={(e)=>e.preventDefault()}
                    onChange={(e)=>handleChange}
                    onInput={(e) =>{inputName == "identity_number" ? (currentDoc(e.target.value), InputHandler(e)):InputHandler(e)}}
                />
                {/* {disable ? <p className='text-white'>Please Select Document Type First</p> : ""} */}
                {/* <!-- error  --> */}
                <div className="input-errors" >
                    {errors[inputName] && touched[inputName] && (<span style={{ color: 'red' }}>{errors[inputName]}</span>)}
                </div>
            </>}
            {type == "date" && <>
                <label className="mb-2">{inputLable}</label>
                <input type="date" className="form-control" placeholder={placeholder}
                    name={inputName}
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 15)).toISOString().split('T')[0]}
                    id={inputName}
                    onChange={handleChange}
                    onInput={e => InputHandler(e)}
                />
                {/* {disable ? <p className='text-white'>Please Select Document Type First</p> : ""} */}
                {/* <!-- error  --> */}
                <div className="input-errors" >
                    {errors[inputName] && touched[inputName] && (<span style={{ color: 'red' }}>{errors[inputName]}</span>)}
                </div>
            </>}
            {type == "textarea" && <>
                <label className="mb-2">{inputLable}</label>
                <textarea className="form-control" placeholder={placeholder}
                    name={inputName}
                    id={inputName}
                    onChange={handleChange}
                    onInput={e => InputHandler(e)}
                />
                {/* {disable ? <p className='text-white'>Please Select Document Type First</p> : ""} */}
                {/* <!-- error  --> */}
                <div className="input-errors" >
                    {errors[inputName] && touched[inputName] && (<span style={{ color: 'red' }}>{errors[inputName]}</span>)}
                </div>
            </>}
            {type == "select" && <>
                <label className="mb-2">{inputLable}</label>
                <select className="form-select" aria-label="Default select example"  name={inputName}
                    onChange={(e) => setFieldValue(inputName,e.target.value) }  id={inputName}>
                    <option value>choose</option>
                    {/* <option value="1">India</option> */}
                    {StateData.map((data, index) => {
                        return (
                            <option key={index} value={data.value}>{data.name}</option>
                        );
                    })}
                </select>
                {/* {disable ? <p className='text-white'>Please Select Document Type First</p> : ""} */}
                {/* <!-- error  --> */}
                <div className="input-errors" >
                    {errors[inputName] && touched[inputName] && (<span style={{ color: 'red' }}>{errors[inputName]}</span>)}
                </div>
            </>}
            {type == "form-select" && <>
                <label className="mb-2">Document Type</label>
                <select className="form-select" aria-label="Default select example"name={inputName}
                    onChange={(e) => setFieldValue(inputName,e.target.value) } id={inputName} >
                         <option value="Document">choose</option>
                    <option value="pan">PAN Card</option>
                </select>
                {/* <!-- error  --> */}
                <div className="input-errors" >
                    {errors.panType && touched.panType && (
                        <span style={{ color: 'red', fontSize: 'small' }}>{errors.panType}</span>)}
                </div>
            </>}
            {type == "form" && <>
          
                <label className="mb-2">Document Type</label>
                <select className="form-select" aria-label="Default select example" name="identity_type"
                    onChange={(e) => {setFieldValue(inputName,e.target.value)} } id={inputName}>
                        {TypeItem.map((val,i)=>{return (
                        <option value={val}>{ val}
                        </option>)
                        })}
                </select>
                {/* <!-- error  --> */}
                <div className="input-errors" >
                    {errors.identity_type && touched.identity_type && (
                        <span style={{ color: 'red', fontSize: 'small' }}>{errors.identity_type}</span>)}
                </div>

            </>}


        </>
    )
}

export default Document