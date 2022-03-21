import React from 'react'

function UserItem(props) {

    const { users , index} = props;

    return (
        <div className="card" style={{ width: "50vw", margin: "30px auto" , backgroundColor:'whitesmoke', borderRadius : '10px' }}>
            <div className="card-body row">
                <h6 className="col-md-12  my-2 ">{index+1}</h6>
                <h6 className="col-md-12  my-2 "><span style={{color : 'rgb(177 14 14)'}}>Name -</span> {users.name}</h6>
                <h6 className="col-md-12  my-2 "><span style={{color : 'rgb(177 14 14)'}}>Email -</span> {users.email}</h6>
            </div>
        </div>
    )
}

export default UserItem