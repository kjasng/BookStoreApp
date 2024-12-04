import { store } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

type Props = {
    children: React.ReactNode;
}

type RootState = ReturnType<typeof store.getState>;

const ProtectedRoute = (props: Props) => {
    const isAuthenticated = useSelector((state: RootState) => state.account.isAuthenticated);
    return <>{isAuthenticated ? props.children : <Navigate to='/login' />}</>;
};

export default ProtectedRoute;
