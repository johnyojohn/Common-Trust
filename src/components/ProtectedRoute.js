import { Navigate } from 'react-router-dom'

const ProtectedRoute=({children:children, user:user})=>{
    console.log(user);
    return user.isChecking ? <div></div> :
        user.user !== null
            ? children
            : <Navigate to="/" replace={true} />
}

export default ProtectedRoute;