import React, { useState, useEffect } from 'react';
import { Form, Input, Radio, Button, Select, DatePicker, message, RadioChangeEvent } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;

interface Address {
    address1: string;
    address2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

interface BaseUser {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    birthDate: string;
    gender: string;
    phone: string;
    CURP: string;
    address: Address;
}

interface AdminUser extends BaseUser {
    role: "admin";
}

interface StudentDetails {
    fieldPosition: string;
    shirtNumber: number;
    IMSS: string;
}

interface StudentUser extends BaseUser {
    role: "student";
    student: StudentDetails;
}

type UserFormValues = Omit<BaseUser, 'role' | 'birthDate' | 'address'> & {
    birthDate: moment.Moment;
    userType: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    school?: string;
    fieldPosition?: string;
    shirtNumber?: number;
    team?: string;
    IMSS?: string;
};

const AddressFields: React.FC = () => (
    <>
        <Form.Item name="address1" rules={[{ required: true }]}>
            <Input placeholder="Calle y Numero" />
        </Form.Item>
        <Form.Item name="address2" rules={[{ required: true }]}>
            <Input placeholder="Colonia" />
        </Form.Item>
        <Form.Item name="city" rules={[{ required: true }]}>
            <Input placeholder="Ciudad" />
        </Form.Item>
        <Form.Item name="state" rules={[{ required: true }]}>
            <Input placeholder="Estado" />
        </Form.Item>
        <Form.Item name="country" rules={[{ required: true }]}>
            <Input placeholder="Pais" />
        </Form.Item>
        <Form.Item name="postalCode" rules={[{ required: true }]}>
            <Input placeholder="Codigo Postal" />
        </Form.Item>
    </>
);

const RegisterUser: React.FC = () => {
    const [form] = Form.useForm();
    const [userType, setUserType] = useState<string>('');
    const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
    const [teams, setTeams] = useState<{ id: string; name: string }[]>([]);

    const handleUserTypeChange = (e: RadioChangeEvent) => {
        setUserType(e.target.value);
    };

    const handleSubmit = async (values: UserFormValues) => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: token };
        const formattedBirthDate = values.birthDate.format('YYYY-MM-DD');
        const { address1, address2, city, state, postalCode, country, birthDate, school, fieldPosition, shirtNumber, team, IMSS, gender, ...rest } = values;

        const address: Address = {
            address1,
            address2,
            city,
            state,
            postalCode,
            country
        };

        let payload: AdminUser | StudentUser;

        if (userType === 'student') {
            const studentDetails: StudentDetails = {
                fieldPosition: fieldPosition!,
                shirtNumber: shirtNumber!,
                IMSS: IMSS!,
            };

            payload = {
                ...rest,
                birthDate: formattedBirthDate,
                gender,
                address,
                role: "student",
                CURP: rest.CURP,
                student: studentDetails,
            } as StudentUser;

        } else {
            payload = {
                ...rest,
                birthDate: formattedBirthDate,
                gender,
                address,
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
                    const errorMessage = error.response.data.message;
                    if (error.response.status === 403) {
                        message.error('No tienes permiso para realizar esta acción.');
                    } else if (error.response.status === 400) {
                        if (errorMessage === 'CURP already exists') {
                            message.error('Una cuenta ya se registró con ese CURP');
                        } else if (errorMessage === 'email already exists') {
                            message.error('Una cuenta ya se registró con ese correo electrónico');
                        } else {
                            message.error(`Error: ${errorMessage || 'Error de servidor'}`);
                        }
                    } else {
                        message.error(`Error: ${errorMessage || 'Error de servidor'}`);
                    }
                } else {
                    message.error('Error de red o servidor, por favor verifica tu conexión.');
                }
            } else {
                message.error('Un error inesperado ha ocurrido.');
            }
            console.error('Error al registar usuario:', error);
        }
    };

    return (
        <div>
            <Form form={form} onFinish={handleSubmit} layout="horizontal">
                <Form.Item name="role" rules={[{ required: true }]}>
                    <Radio.Group onChange={handleUserTypeChange}>
                        <Radio value="admin">Administrador</Radio>
                        <Radio value="student">Jugador</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item name="gender" rules={[{ required: true }]}>
                    <Radio.Group>
                        <Radio value="MALE">Masculino</Radio>
                        <Radio value="FEMALE">Feminino</Radio>
                    </Radio.Group>
                </Form.Item>

                {/* Common fields */}
                <Form.Item name="firstName" rules={[{ required: true }]}>
                    <Input placeholder="Nombres" />
                </Form.Item>

                <Form.Item name="lastName" rules={[{ required: true }]}>
                    <Input placeholder="Apellidos" />
                </Form.Item>

                <Form.Item name="email" rules={[
                    { required: true, type: 'email' },
                    { type: 'email', message: 'Por favor ingrese un email válido' }
                ]}>
                    <Input placeholder="Email" />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, min: 8 }]}>
                    <Input.Password placeholder="Contraseña" />
                </Form.Item>
                <Form.Item name="birthDate" rules={[{ required: true }]}>
                    <DatePicker placeholder="Fecha de nacimiento" format="YYYY-MM-DD" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="phone" rules={[
                    { required: true },
                    { pattern: /^\+?\d{10}$/, message: 'Por favor ingresa un número de teléfono válido' },]}>
                    <Input placeholder="Teléfono" />
                </Form.Item>
                <Form.Item name="CURP" rules={[
                    { required: true },
                    { pattern: /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/, message: 'Por favor ingrese un CURP válido' }
                ]}>
                    <Input placeholder="CURP" />
                </Form.Item>

                <AddressFields />

                {userType === 'student' && (
                    <>
                        <Form.Item name="IMSS" rules={[{ required: true }]}>
                            <Input placeholder="No. de IMMS" />
                        </Form.Item>
                        <Form.Item name="fieldPosition" rules={[{ required: true }]}>
                            <Input placeholder="Posición de campo" />
                        </Form.Item>
                        <Form.Item name="shirtNumber" rules={[{ required: true }]}>
                            <Input type="number" placeholder="Número de playera" />
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
