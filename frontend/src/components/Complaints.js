import React, { useState , useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import AlertContext from './context/AlertContext'

const Complaints = () => {

    const [complaint, setcomplaint] = useState({ email: "", title: "", description: "" })
    let navigate = useNavigate();

    const context = useContext(AlertContext);
    const { addAlert } = context;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { email, title, description } = complaint;
        const response = await fetch(
            'http://localhost:5000/api/complaint/create',
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, title, description }),
            }
        );
        
        const json = await response.json();
       if (json.success) {
            addAlert({
                type: 'success',
                msg: 'Complaint Register Successfully'
            })
            navigate("/");
        }
        else {
            addAlert({
                type: 'danger',
                msg: json.error
            })
            return;
        }
    }
    const onChange = (e) => {
        setcomplaint({ ...complaint, [e.target.name]: e.target.value })
    }
    return (
        <div className='update-container'>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" className="form-control" onChange={onChange} aria-describedby="emailHelp"
                        id="email" name="email" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" onChange={onChange} aria-describedby="emailHelp"
                        id="title" name="title" required minLength={5} />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" onChange={onChange} aria-describedby="emailHelp"
                        id="description" name="description" required minLength={10} />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>

        </div>
    )
}

export default Complaints