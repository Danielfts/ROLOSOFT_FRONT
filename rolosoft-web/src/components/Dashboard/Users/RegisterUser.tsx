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
        const token = localStorage.getItem('token');
        const headers = { Authorization: token };
        const formattedBirthDate = values.birthDate.format('YYYY-MM-DD');
        const { birthDate, school, fieldPosition, shirtNumber, team, IMSS, gender, ...rest } = values;

        let payload: AdminUser | StudentUser;

        if (userType === 'student') {
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
            const response = await axios.post(process.env.REACT_APP_USERS_API_URL!, payload, { headers });
            if (response.status === 201) {
                message.success('El usuario fue registrado exitosamente!');
                form.resetFields();
            } else {
                message.error('No estás autorizado para realizar esta acción.');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    if (error.response.status === 403) {
                        message.error('No tienes permiso para realizar esta acción.');
                    } else if (error.response.status === 400) {
                        message.error('Una cuenta ya se registró con ese correo electrónico.');
                    } else {
                        message.error(`Error: ${error.response.data.message || 'Error de servidor'}`);
                    }
                } else {
                    message.error('Error de red o servidor, por favor verifica tu conexión.');
                }
            } else {
                message.error('Un error inesperado ha ocurrido.');
            }
            console.error('Error while registering user:', error);
        }
    };

    return (
        <div style={formContainerStyle}>
            <Form {...formItemLayout} form={form} onFinish={handleSubmit} style={formStyle} layout="horizontal">
                <Form.Item name="role" label="Tipo de usuario" rules={[{ required: true }]}>
                    <Radio.Group onChange={handleUserTypeChange}>
                        <Radio value="admin">Administrador</Radio>
                        <Radio value="student">Jugador</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item name="gender" label="Género" rules={[{ required: true }]}>
                    <Radio.Group>
                        <Radio value="MALE">Masculino</Radio>
                        <Radio value="FEMALE">Feminino</Radio>
                    </Radio.Group>
                </Form.Item>

                {/* Common fields */}
                <Form.Item name="firstName" label="Nombres" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="lastName" label="Apellidos" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="email" label="Email" rules={[
                    { required: true, type: 'email' },
                    { type: 'email', message: 'Por favor ingrese un email válido' }
                ]}>
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="Contraseña" rules={[{ required: true, min: 8 }]}>
                    <Input.Password />
                </Form.Item>
                <Form.Item name="birthDate" label="Fecha de nacimiento" rules={[{ required: true }]}>
                    <DatePicker format="YYYY-MM-DD" />
                </Form.Item>
                <Form.Item name="phone" label="Teléfono" rules={[
                    { required: true },
                    { pattern: /^\+?\d{10}$/, message: 'Por favor ingresa un número de teléfono válido' },]}>
                    <Input />
                </Form.Item>
                <Form.Item name="CURP" label="CURP" rules={[
                    { required: true },
                    { pattern: /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/, message: 'Por favor ingrese un CUPRP valido' }
                ]}>
                    <Input />
                </Form.Item>

                {userType === 'student' && (
                    <>

                        <Form.Item name="IMSS" label="No. de IMMS" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="parentCURP" label="CURP del padre, madre o tutor" rules={[
                            { required: true },
                            { pattern: /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/, message: 'Por favor ingrese un CUPRP valido' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="school" label="Escuela" rules={[{ required: true }]}>
                            <Select>
                                <Option value="colegioA">Colegio A</Option>
                                <Option value="colegioB">Colegio B</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="fieldPosition" label="Posición de campo" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="shirtNumber" label="Número de playera" rules={[{ required: true }]}>
                            <Input type="number" />
                        </Form.Item>
                        <Form.Item name="team" label="Equipo" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>

                    </>
                )}

                <Form.Item wrapperCol={{ offset: 10, span: 14 }}>
                    <Button type="primary" htmlType="submit">Registrar</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default RegisterUser;
