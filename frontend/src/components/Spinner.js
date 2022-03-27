import React from 'react'
import spinner from '../img/Spinner.gif'

// Spinner when component is  loading
const Spinner = () => {

    return (
        <div className='container text-center my-3'>
            <img src={spinner} alt={spinner} />
        </div>
    )
}

export default Spinner
