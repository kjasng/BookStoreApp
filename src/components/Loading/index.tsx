import { MoonLoader } from "react-spinners";

const Loading = () => {
    return <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 z-[9999]"><MoonLoader color="#73c2fb" /></div>
}

export default Loading