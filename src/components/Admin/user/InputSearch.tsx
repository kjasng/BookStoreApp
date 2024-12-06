import { Input } from "antd";

const InputSearch = () => {
    return (
        <div className="flex flex-row justify-center items-center w-full p-4 bg-gray-200 rounded-xl pb-12">
            <div className="w-full p-2 flex flex-col gap-2">
                <h1>Name</h1>
                <Input placeholder="Input name" />
            </div>
            <div className="w-full p-2 flex flex-col gap-2">
                <h1>Email</h1>
                <Input placeholder="Input email" />
            </div>
            <div className="w-full p-2 flex flex-col gap-2">
                <h1>Phone</h1>
                <Input placeholder="Input phone" />
            </div>
        </div>
    );
};

export default InputSearch;
