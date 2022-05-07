import {useEffect, useState} from 'react';

const ThreadOverview = ({ data }) => {
    const {id} = useParams();
    // useEffect(() => {
    //     fetch(('BACKEND_URL' + id.toString()))
    //     .then(response => response.json())
    // }, []);

    return (
        <div className = "container">
            <div className = "row">
                <div className = "col-md-12">
                    {/* <h1>{data.title}</h1> */}
                    <h3>Question Title</h3>
                </div>
            </div>
            <div className = "row">
                <div className = "col-md-12">
                    {/* <h1>{data.body}</h1> */}
                    <h4>Question Body</h4>
                </div>
            </div>
        </div>
    )
}

export default ThreadOverview;