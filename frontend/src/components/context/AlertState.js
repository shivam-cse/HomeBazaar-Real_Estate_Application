import React, { useState } from 'react'
import AlertContext from './AlertContext'

function AlertState(props) {

    const [alert, setalert] = useState(null)

    const addAlert = (Alert) => {
        setalert(Alert)
    }

    return (
        <AlertContext.Provider value={{ addAlert, alert }}>
            {props.children}
        </AlertContext.Provider>
    )
}

export default AlertState

