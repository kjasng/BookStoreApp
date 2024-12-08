import { useState } from "react";
import InputSearch from "./InputSearch";

const UserPage = () => {
    const [open, setOpen] = useState<boolean>(false);

    const showDrawer = () => {
        setOpen(true);
    };
    return (
        <div className="flex flex-col gap-4">
            <InputSearch showDrawer={showDrawer} open={open} />
        </div>
    );
};

export default UserPage;
