import { Navigate } from 'react-router-dom'

const UnprotectedRoute=({children:children, user:user})=>{
    console.log(user);
    return user.isChecking ? <div></div> :
        user.user === null
            ? children
            : <Navigate to="/class" replace={true} />
}

export default UnprotectedRoute;