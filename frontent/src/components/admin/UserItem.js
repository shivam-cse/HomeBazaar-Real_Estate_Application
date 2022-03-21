import React from 'react'
import { useNavigate } from 'react-router-dom';

function UserItem(props) {

    const { users, index, userType, id, handleOnclick } = props;
    console.log(id)

    return (
        <div className="card" style={{ width: "30vw", margin: "30px auto", backgroundColor: 'whitesmoke', borderRadius: '10px' }}>
            <div className="card-body row">
                <h6 className="col-md-12  my-2 ">{index + 1}</h6>
                <h6 className="col-md-12  my-2 "><span style={{ color: 'rgb(177 14 14)' }}>Name -</span> {users.name}</h6>
                <h6 className="col-md-12  my-2 "><span style={{ color: 'rgb(177 14 14)' }}>Email -</span> {users.email}</h6>
                <button className="col-md-12 btn btn-primary mx-3 my-2" onClick={() => handleOnclick(id, userType)} role="button" aria-disabled="true" style={{ width: '50%' }}> Delete </button>
            </div>
        </div>
    )
}

export default UserItem