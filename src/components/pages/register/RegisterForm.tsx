import { Alert, Button, Checkbox, Form, Input } from "antd";
import axios from "axios";
import { useState } from "react";

type FieldType = {
    fullName: string,
    email: string,
    password: string,
    phone: number,
  };



const RegisterForm:React.FC = () => {
    const [response, setResponse] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [notification, setNotification] = useState<boolean>(false);
    const [form] = Form.useForm();

    const validateMessages = {
        required: '${label} is required!',
        types: {
          email: '${label} is not a valid email!',
          phone: '${label} is not a valid phone number!',
        },
        number: {
          range: '${label} must be between ${min} and ${max}',
        },
      };

      const handleSignUp = (values: FieldType, setResponse: React.Dispatch<React.SetStateAction<boolean>>, setNotification: React.Dispatch<React.SetStateAction<boolean>>) => {


        axios.post('http://localhost:8080/api/v1/user/register', {
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          phone: values.phone
        })
        .then(() => {
          setNotification(true);
          setResponse(true);
        })
        .catch(() => {
          setNotification(true);
          setResponse(false);
        })
      }

    return (
        <div className='w-11/12 md:w-1/2 h-auto flex flex-col gap-4 justify-center items-center px-12 lg:px-4 bg-white rounded-lg py-4 shadow-xl'>
            <h1 className='text-2xl font-bold'>Register</h1>

      <Form
      className='flex flex-col w-full'
        name="basic"
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 24 }}
        style={{ maxWidth: 480 }}
        initialValues={{ remember: true }}
        autoComplete="off"
        validateMessages={validateMessages}
      >
    
        <Form.Item<FieldType>
          className='mb-2'
          label="Full Name"
          name='fullName'
          labelCol={{span: 24}}
          rules={[{ required: true, message: 'Please input your full name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          className='mb-2'
          label="Email"
          name='email'
          labelCol={{span: 24}}
          rules={[{ type: 'email', required: true, message: 'Please input your email address!' }]}
        >
          <Input />
        </Form.Item>
    
        <Form.Item<FieldType>
          label="Password"
          name='password'
          className='mb-2'
          labelCol={{span: 24}}
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
          label="Phone"
          name='phone'
          labelCol={{span: 24}}
          rules={[{required: true, message: 'Please input your phone number!'}]}
        >
          <Input type='number' />
        </Form.Item>
    
        <div className='flex justify-between flex-col w-full'>
            <Form.Item<FieldType> name='remember' valuePropName="checked" label={null} className='flex flex-row gap-2 items-center justify-center w-full'>
              <Checkbox className='min-w-max'>Remember me</Checkbox>
            </Form.Item>
        
            <Form.Item label={null} className='w-full flex justify-center items-center'>
              <Button type="primary" htmlType="submit" onClick={() => {
                
                setLoading(!loading);
                setTimeout(() => {
                  setNotification(false);
                  setLoading(false);
                }, 3000);
                handleSignUp(form.getFieldsValue(), setResponse, setNotification)
              }}>
                {loading ? 'Loading...' : 'Submit'}
              </Button>
            </Form.Item>
        </div>
      </Form>
      <div className='absolute bottom-10 right-6'>{notification ? (response ? <Alert message="Successfully registered" type="success" /> : <Alert message="Please input missing fields" type="error" />) : null}</div>
  </div>
    )
}

export default RegisterForm