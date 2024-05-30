import React, { useState } from 'react';
import { Form, Input, Radio, Button, DatePicker, message, RadioChangeEvent } from 'antd';
import moment from 'moment';
import { Address, User, Student } from '../../../types/types';
import { registerUser } from '../../../services/userService';

const { Item: FormItem } = Form;

type UserFormValues = Omit<User, 'id' | 'role' | 'birthDate' | 'address'> & {
    birthDate: moment.Moment;
    userType: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    fieldPosition?: string;
    shirtNumber?: number;
    IMSS?: string;
};

const AddressFields: React.FC = () => (
    <>
        <FormItem name="address1" rules={[{ required: true }]}>
            <Input placeholder="Calle y Número" />
        </FormItem>
        <FormItem name="address2">
            <Input placeholder="Colonia" />
        </FormItem>
        <FormItem name="city" rules={[{ required: true }]}>
            <Input placeholder="Ciudad" />
        </FormItem>
        <FormItem name="state" rules={[{ required: true }]}>
            <Input placeholder="Estado" />
        </FormItem>
        <FormItem name="country" rules={[{ required: true }]}>
            <Input placeholder="País" />
        </FormItem>
        <FormItem name="postalCode" rules={[{ required: true }]}>
            <Input placeholder="Código Postal" />
        </FormItem>
    </>
);

const RegisterUser: React.FC = () => {
    const [form] = Form.useForm();
    const [userType, setUserType] = useState<string>('');

    const handleUserTypeChange = (e: RadioChangeEvent) => {
        setUserType(e.target.value);
    };

    const handleSubmit = async (values: UserFormValues) => {
        const token = localStorage.getItem('token');
        if (!token) {
            message.error('No se encontró ningún token, por favor inicie sesión');
            return;
        }

        const formattedBirthDate = values.birthDate.format('YYYY-MM-DD');
        const { address1, address2, city, state, postalCode, country, birthDate, fieldPosition, shirtNumber, IMSS, userType, ...rest } = values;

        const address: Address = {
            address1,
            address2: address2 || '',
            city,
            state,
            postalCode,
            country
        };

        let payload: User | Student;

        if (userType === 'student') {
            payload = {
                ...rest,
                birthDate: formattedBirthDate,
                address,
                role: "student",
                student: {
                    fieldPosition: fieldPosition!,
                    shirtNumber: shirtNumber!,
                    IMSS: IMSS!,
                }
            } as Student;
        } else {
            payload = {
                ...rest,
                birthDate: formattedBirthDate,
                address,
                role: "admin"
            } as User;
        }

        try {
            const success = await registerUser(token, payload);
            if (success) {
                message.success('El usuario fue registrado exitosamente!');
                form.resetFields();
            } else {
                message.error('No estás autorizado para realizar esta acción.');
            }
        } catch (error) {
            console.error('Error al registrar usuario:', error);
        }
    };

    return (
        <div>
            <Form form={form} onFinish={handleSubmit} layout="horizontal">
                <FormItem name="role" rules={[{ required: true }]}>
                    <Radio.Group onChange={handleUserTypeChange}>
                        <Radio value="admin">Administrador</Radio>
                        <Radio value="student">Jugador</Radio>
                    </Radio.Group>
                </FormItem>

                <FormItem name="gender" rules={[{ required: true }]}>
                    <Radio.Group>
                        <Radio value="MALE">Masculino</Radio>
                        <Radio value="FEMALE">Femenino</Radio>
                    </Radio.Group>
                </FormItem>

                {/* Common fields */}
                <FormItem name="firstName" rules={[{ required: true }]}>
                    <Input placeholder="Nombres" />
                </FormItem>

                <FormItem name="lastName" rules={[{ required: true }]}>
                    <Input placeholder="Apellidos" />
                </FormItem>

                <FormItem name="email" rules={[
                    { required: true, type: 'email' },
                    { type: 'email', message: 'Por favor ingrese un email válido' }
                ]}>
                    <Input placeholder="Email" />
                </FormItem>

                <FormItem name="password" rules={[{ required: true, min: 8 }]}>
                    <Input.Password placeholder="Contraseña" />
                </FormItem>

                <FormItem name="birthDate" rules={[{ required: true }]}>
                    <DatePicker placeholder="Fecha de nacimiento" format="YYYY-MM-DD" style={{ width: '100%' }} />
                </FormItem>

                <FormItem name="phone" rules={[
                    { required: true },
                    { pattern: /^\+?\d{10}$/, message: 'Por favor ingresa un número de teléfono válido' },
                ]}>
                    <Input placeholder="Teléfono" />
                </FormItem>

                <FormItem name="CURP" rules={[
                    { required: true },
                    {
                        pattern: /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/,
                        message: 'Por favor ingrese un CURP válido'
                    }
                ]}>
                    <Input placeholder="CURP" />
                </FormItem>

                <AddressFields />

                {userType === 'student' && (
                    <>
                        <FormItem name="IMSS" rules={[{ required: true }]}>
                            <Input placeholder="No. de IMMS" />
                        </FormItem>
                        <FormItem name="fieldPosition" rules={[{ required: true }]}>
                            <Input placeholder="Posición de campo" />
                        </FormItem>
                        <FormItem name="shirtNumber" rules={[{ required: true }]}>
                            <Input type="number" placeholder="Número de playera" />
                        </FormItem>
                    </>
                )}

                <FormItem wrapperCol={{ offset: 10, span: 14 }}>
                    <Button type="primary" htmlType="submit">Registrar</Button>
                </FormItem>
            </Form>
        </div>
    );
};

export default RegisterUser;
