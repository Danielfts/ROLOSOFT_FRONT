import React, { useState } from 'react';
import { Form, Input, Radio, Button, Select, DatePicker, message, RadioChangeEvent } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;

const formContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: '#f0f2f5',
    padding: '20%',
};

const formStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: '100vh',
    padding: '10vh',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const formItemLayout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 14 },
};

interface BaseUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    birthDate: string;
    gender: string;
    phone: string;
    CURP: string;
}

interface AdminUser extends BaseUser {
    role: "admin";
}

interface StudentDetails {
    school: string;
    fieldPosition: string;
    shirtNumber: number;
    team: string;
    IMSS: string;
}

interface StudentUser extends BaseUser {
    role: "student";
    student: StudentDetails;
}

type UserFormValues = Omit<BaseUser, 'role' | 'birthDate'> & {
    birthDate: moment.Moment;
    userType: string;
    school?: string;
    fieldPosition?: string;
    shirtNumber?: number;
    team?: string;
    IMSS?: string;
};

const RegisterUser: React.FC = () => {
    const [form] = Form.useForm<UserFormValues>();
    const [userType, setUserType] = useState<string>('');

    const handleUserTypeChange = (e: RadioChangeEvent) => {
        setUserType(e.target.value);
    };

    const handleSubmit = async (values: UserFormValues) => {
        const { birthDate, school, fieldPosition, shirtNumber, team, IMSS, gender, ...rest } = values;
        const formattedBirthDate = birthDate.format('YYYY-MM-DD');

        let payload: AdminUser | StudentUser;

        if (userType === 'player') {
            const studentDetails: StudentDetails = {
                school: school!,
                fieldPosition: fieldPosition!,
                shirtNumber: shirtNumber!,
                team: team!,
                IMSS: IMSS!,
            };

            payload = {
                ...rest,
                birthDate: formattedBirthDate,
                gender,
                role: "student",
                CURP: rest.CURP,
                student: studentDetails,
            } as StudentUser;

        } else {
            payload = {
                ...rest,
                birthDate: formattedBirthDate,
                gender,
                role: "admin",
                CURP: rest.CURP,
            } as AdminUser;
        }

        try {
            const endpoint = process.env.REACT_APP_CREATE_USER_API_URL;
            const response = await axios.post(endpoint!, payload);
            if (response.status === 201) {
                message.success('User registered successfully!');
                form.resetFields();
            } else {
                message.error('Registration failed: ' + response.data.message);
            }
        } catch (error) {
            message.error('Network or server error');
            console.error('Registration error:', error);
        }
    };

    return (
        <div style={formContainerStyle}>
            <Form {...formItemLayout} form={form} onFinish={handleSubmit} style={formStyle} layout="horizontal">
                <Form.Item name="userType" label="User Type" rules={[{ required: true }]}>
                    <Radio.Group onChange={handleUserTypeChange}>
                        <Radio value="admin">Admin</Radio>
                        <Radio value="player">Player</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
                    <Radio.Group>
                        <Radio value="MALE">Masculine</Radio>
                        <Radio value="FEMALE">Feminine</Radio>
                    </Radio.Group>
                </Form.Item>

                {/* Common fields */}
                <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="Password" rules={[{ required: true, min: 8 }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item name="birthDate" label="Birth Date" rules={[{ required: true }]}>
                    <DatePicker />
                </Form.Item>
                <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="CURP" label="CURP" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                {userType === 'player' && (
                    <>
                        <Form.Item name="school" label="School" rules={[{ required: true }]}>
                            <Select>
                                <Option value="colegioA">Colegio A</Option>
                                <Option value="colegioB">Colegio B</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="fieldPosition" label="Field Position" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="shirtNumber" label="Shirt Number" rules={[{ required: true }]}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item name="team" label="Team" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="IMSS" label="IMSS Number" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </>
                )}

                <Form.Item wrapperCol={{ offset: 10, span: 14 }}>
                    <Button type="primary" htmlType="submit">Register</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default RegisterUser;
