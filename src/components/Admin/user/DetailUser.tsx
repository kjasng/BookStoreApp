import { Badge, Descriptions, Table } from "antd";
import moment from "moment";

const DetailUser: React.FC = ({ user }) => {
    const userInfo = [
        {
            id: user[0]._id,
            fullName: user[0].fullName,
            email: user[0].email,
            phoneNumber: user[0].phone,
            role: user[0].role,
            createdAt: user[0].createdAt,
            updatedAt: user[0].updatedAt,
        },
    ];

    console.log(user[0]._id);
    return (
        <Descriptions title="User Info" bordered layout="vertical" column={2}>
            <Descriptions.Item label="ID">{userInfo[0].id}</Descriptions.Item>
            <Descriptions.Item label="Full name">
                {userInfo[0].fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
                {userInfo[0].email}
            </Descriptions.Item>
            <Descriptions.Item label="Phone number">
                {userInfo[0].phoneNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Role" span={2}>
                <Badge status="processing" text={userInfo[0].role} />
            </Descriptions.Item>
            <Descriptions.Item label="Created at">
                {moment(userInfo[0].createdAt).format("DD/MM/YYYY hh:mm:ss")}
            </Descriptions.Item>
            <Descriptions.Item label="Updated at">
                {moment(userInfo[0].updatedAt).format("DD/MM/YYYY hh:mm:ss")}
            </Descriptions.Item>
        </Descriptions>
    );
};

export default DetailUser;
