import { message } from "antd";
import { JSXElementConstructor } from "react";

type MessageProps = {
    type: string;
    content: string;
};

const MessageComponent: JSXElementConstructor<MessageProps> = ({ ...props }) => {
    const [messageApi, contextHolder] = message.useMessage();

    const success = () => {
        messageApi.open({
            type: "success",
            content: props.content,
        });
    };
    const error = () => {
        messageApi.open({
            type: "error",
            content: props.content,
        });
    };

    if (props.type === "success") {
        success();
    } else if (props.type === "error") {
        error();
    }

    return <>{contextHolder}</>;
};

export default MessageComponent;
