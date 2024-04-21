import React from 'react';
import { Button, DatePicker, Form, Input, InputNumber, Select, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

const App: React.FC = () => (
  <Form {...formItemLayout} variant="filled" style={{ maxWidth: 600 }}>
    <Form.Item
      label="Nombre Completo"
      name="fullName"
      rules={[{ required: true, message: 'Por favor ingresa tu nombre completo' }]}
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
      <Input />
    </Form.Item>

    <Form.Item
      label="CURP"
      name="curp"
      rules={[{ required: true, message: 'Por favor ingresa tu CURP' }]}
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
      rules={[{ required: true, message: 'Por favor ingresa tu teléfono de contacto' }]}
    >
      <Input />
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
        { type: 'string', len: 11, message: 'El número de afiliación IMSS debe tener 11 dígitos' },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item label="Añadir una fotografía personalizada">
      <Form.Item name="photo" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
        <Upload.Dragger name="photo" multiple={false} accept="image/*">
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Haz clic o arrastra una imagen aquí para subirla</p>
          <p className="ant-upload-hint">Imagen no mayor a 1MB</p>
        </Upload.Dragger>
      </Form.Item>
    </Form.Item>

    <Form.Item
      label="Documentación física"
      name="physicalDocumentation"
      rules={[{ required: true, message: 'Por favor sube la documentación física requerida' }]}
    >
      <Dragger name="physicalDocumentation" multiple={true}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Haz clic o arrastra los archivos aquí para subirlos</p>
        <p className="ant-upload-hint">Carta deslinde de responsabilidades, CURP del participante, INE del padre, madre o tutor</p>
      </Dragger>
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
      <Button type="primary" htmlType="submit">
        Enviar
      </Button>
    </Form.Item>
  </Form>
);

const normFile = (e: { fileList: any }) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

export default App;
