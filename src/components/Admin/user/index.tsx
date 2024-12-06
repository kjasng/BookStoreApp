import InputSearch from "./InputSearch";
import UserTable from "./UserTable";

const UserPage = () => {
    return (
        <div className="flex flex-col gap-4">
            <InputSearch />
            <UserTable />
        </div>
    );
};

export default UserPage;
