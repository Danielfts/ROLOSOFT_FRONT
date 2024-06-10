import React, { useState } from 'react';
import { Modal, Form, Upload, Button, message, UploadProps } from 'antd';
import { PlusOutlined, InboxOutlined, LoadingOutlined } from '@ant-design/icons';
import { School } from '../../../types/types';
import { uploadSchoolShield } from '../../../services/schoolService';

type EditSchoolProps = {
  visible: boolean;
  onCancel: () => void;
  school: School;
  onSave: (updatedSchool: School) => void;
};

const EditSchool: React.FC<EditSchoolProps> = ({ visible, onCancel, school, onSave }) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Solo puedes subir archivos JPG/PNG!');
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('La imagen debe ser menor a 2MB!');
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const handleChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0) {
      const lastFile = newFileList[newFileList.length - 1];
      if (lastFile.originFileObj) {
        const base64Url = await getBase64(lastFile.originFileObj);
        setImageUrl(base64Url);
      }
    } else {
      setImageUrl('');
    }
  };

  const handleUpload = async () => {
    if (!fileList.length) {
      message.error('Por favor, selecciona un archivo de imagen para subir');
      return;
    }

    const imageFile = fileList[0].originFileObj as File;

    setLoading(true);

    try {
      const filename = await uploadSchoolShield(localStorage.getItem('token')!, school.id, imageFile);
      if (!filename) throw new Error('Error al subir la imagen');

      const shieldUrl = `${process.env.REACT_APP_BASE_URL}/static/${filename}`;
      const updatedSchool = { ...school, shieldUrl };

      message.success('Escudo de la escuela actualizado exitosamente!');
      onSave(updatedSchool); 
      onCancel(); 
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Subir</div>
    </div>
  );

  return (
    <Modal
      visible={visible}
      title="Editar Escudo de la Escuela"
      footer={null}
      onCancel={onCancel}
    >
      <Form layout="vertical">
        <Form.Item style={{ textAlign: 'center' }}>
          <Upload.Dragger
            name="file"
            multiple={false}
            fileList={fileList}
            listType="picture-card"
            beforeUpload={beforeUpload}
            onChange={handleChange}
            showUploadList={false}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="escudo" style={{ width: '100%' }} />
            ) : (
              <div>
                {loading ? <LoadingOutlined /> : <InboxOutlined />}
                <div style={{ marginTop: 8 }}>Haz clic o arrastra el archivo aquí para subir</div>
                <div>Elija una sola imagen en formato JPG/PNG y menor a 2MB</div>
              </div>
            )}
          </Upload.Dragger>
        </Form.Item>
        <Form.Item style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            onClick={handleUpload}
            loading={loading}
          >
            Subir
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditSchool;
