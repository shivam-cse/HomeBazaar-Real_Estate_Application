import React, { useContext } from 'react'
import AlertContext from './context/AlertContext'

// && is same as c++ && if first is false do not check second
function ALert() {

    // using to accessed data without passing the props down manually to each level(component hierarch)
    const context = useContext(AlertContext);
    const { alert, addAlert } = context; // getting alert(state) and addlert(fnction)

    // after 5 sec removing alert
    setTimeout(() => {
        addAlert(null);
    }, 5000);

    // captilize the first letter of word
    const capitalize = (word) => {
        const lower = word;
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    }

    return (
        <div style={{ height: '50px' }}>
            {alert && <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                {alert.msg}
            </div>}
        </div>
    )
}

export default ALert
