import React from 'react';
import { Button, Cascader, DatePicker, Form, Input, InputNumber, Select, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
const { Option } = Select;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
    },
};

const App: React.FC = () => (
    <Form {...formItemLayout} variant="filled" style={{ maxWidth: 600 }}>
        <Form.Item
            label="Nombre(s)"
            name="firstName"
            rules={[{ required: true, message: 'Por favor ingresa tu(s) nombre(s)' }]}
        >
            <Input />
        </Form.Item>

        <Form.Item
            label="Apellido(s)"
            name="lastName"
            rules={[{ required: true, message: 'Por favor ingresa tu(s) apellido(s)' }]}
        >
            <Input />
        </Form.Item>

        <Form.Item
            label="Fecha de nacimiento"
            name="dateOfBirth"
            rules={[{ required: true, message: 'Por favor selecciona tu fecha de nacimiento' }]}
        >
            <DatePicker />
        </Form.Item>

        <Form.Item
            label="Escuela"
            name="school"
            rules={[{ required: true, message: 'Por favor selecciona tu escuela' }]}
        >
            <Select>
                <Option value="escuela1">Escuela 1</Option>
                <Option value="escuela2">Escuela 2</Option>
            </Select>
        </Form.Item>

        <Form.Item
            label="Grado"
            name="grade"
            rules={[{ required: true, message: 'Por favor selecciona tu grado' }]}
        >
            <Select>
                <Option value="grado1">Grado 1</Option>
                <Option value="grado2">Grado 2</Option>
            </Select>
        </Form.Item>

        <Form.Item
            label="Domicilio"
            name="address"
            rules={[{ required: true, message: 'Por favor ingresa tu domicilio' }]}
        >
            <Input placeholder="Calle, Numero, Colonia, Municipio, Código Postal" />
        </Form.Item>

        <Form.Item
            label="CURP"
            name="curp"
            rules={[
                { required: true, message: 'Por favor ingresa tu CURP' },
                { pattern: /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/, message: 'Por favor ingresa un CURP válido' }
            ]}
        >
            <Input />
        </Form.Item>


        <Form.Item
            label="Nombre del padre, madre o tutor"
            name="parentName"
            rules={[{ required: true, message: 'Por favor ingresa el nombre del padre, madre o tutor' }]}
        >
            <Input />
        </Form.Item>

        <Form.Item
            label="Teléfono de contacto"
            name="phone"
            rules={[
                { required: true, message: 'Por favor ingresa tu teléfono de contacto' },
                { pattern: /^\+?\d{10}$/, message: 'Por favor ingresa un número de teléfono válido' },
            ]}
        >
            <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
        </Form.Item>


        <Form.Item
            label="Correo electrónico"
            name="email"
            rules={[
                { required: true, message: 'Por favor ingresa tu correo electrónico' },
                { type: 'email', message: 'Por favor ingresa un correo electrónico válido' },
            ]}
        >
            <Input />
        </Form.Item>

        <Form.Item
            label="No. afiliación IMSS"
            name="imssNumber"
            rules={[
                { required: true, message: 'Por favor ingresa tu número de afiliación del IMSS' },
                { pattern: /^(\d{2})(\d{2})(\d{2})\d{5}$/, message: 'Por favor ingresa un numero de afiliacion valido' },
            ]}
        >
            <Input />
        </Form.Item>

        <Form.Item
            label="Añadir una fotografía personalizada"
            name="photo"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true, message: 'Por favor sube la fotografía personalizada' }]}
        >
            <Dragger name="photo" accept="image/*" maxCount={1}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Haz clic o arrastra una imagen aquí para subirla</p>
                <p className="ant-upload-hint">Imagen no mayor a 1MB</p>
            </Dragger>
        </Form.Item>

        <Form.Item
            label="Carta deslinde de responsabilidades"
            name="liabilityLetter"
            rules={[{ required: true, message: 'Por favor sube la documentación física requerida' }]}
        >
            <Dragger name="liabilityLetter" maxCount={1}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Haz clic o arrastra el archivo aquí para subirlo</p>
                <p className="ant-upload-hint">Carta deslinde de responsabilidades</p>
            </Dragger>
        </Form.Item>


        <Form.Item
            label="CURP del participante"
            name="curpLetter"
            rules={[{ required: true, message: 'Por favor sube la documentación física requerida' }]}
        >
            <Dragger name="curpLetter" maxCount={1}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Haz clic o arrastra los archivos aquí para subirlos</p>
                <p className="ant-upload-hint">CURP del participante</p>
            </Dragger>
        </Form.Item>

        <Form.Item
            label="INE del padre, madre o tutor"
            name="ineParent"
            rules={[{ required: true, message: 'Por favor sube la documentación física requerida' }]}
        >
            <Dragger name="ineParent" maxCount={1}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Haz clic o arrastra los archivos aquí para subirlos</p>
                <p className="ant-upload-hint">INE del padre, madre o tutor</p>
            </Dragger>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" htmlType="submit">
                Enviar
            </Button>
        </Form.Item>
    </Form>
);

const prefixSelector = (
    <Form.Item name="prefix" noStyle>
        <Select style={{ width: 70 }}>
            <Option value="52">+52</Option>
        </Select>
    </Form.Item>
);

const normFile = (e: { fileList: any }) => {
    if (Array.isArray(e)) {
        return e;
    }
    return e && e.fileList;
};

export default App;
