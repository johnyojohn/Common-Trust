import { Navigate } from 'react-router-dom'

const UnprotectedRoute=({children:children, user:user})=>{
    return user.isChecking ? <div></div> :
        user.user === null
            ? children
            : <Navigate to="/user" replace={true} />
}

export default UnprotectedRoute;