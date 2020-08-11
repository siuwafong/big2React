import React from 'react'
import './ErrorMsg.css'

function ErrorMsg({ errorMsg, setErrorMsg }) {

    const showMsg = () => {
        clearTimeout(showMsg)
        setTimeout(() => 
        setErrorMsg({...errorMsg, visibility: "hidden"}), 5000)
        return errorMsg.errorMsg
    }

    return (
        <div>
            <p style={{visibility: errorMsg.visibility}} className="errorMsg">{errorMsg.errorMsg !== null ? showMsg() : null} </p>
        </div>
    )
}

export default ErrorMsg
