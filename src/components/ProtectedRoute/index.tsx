import { store } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import NotPermission from "./NotPermission";

type Props = {
    children: React.ReactNode;
}

type RootState = ReturnType<typeof store.getState>;

const RoleBaseRoute = (props: Props) => {
    const isAdminRoute = window.location.pathname.startsWith("/admin");
    const user = useSelector((state: RootState) => state.account.user);
    const userRole = user.role;
    console.log(userRole);

    if(isAdminRoute && userRole === 'ADMIN') {
        return (
            <>{props.children}</>
        )
    } else {
        return (
            <NotPermission />
        )
    }
};

const ProtectedRoute = (props: Props) => {
    const isAuthenticated = useSelector((state: RootState) => state.account.isAuthenticated);
    return <>{isAuthenticated ? <RoleBaseRoute>{props.children}</RoleBaseRoute> : <Navigate to='/login' replace />}</>;
};

export default ProtectedRoute;
