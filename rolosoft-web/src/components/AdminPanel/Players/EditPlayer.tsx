import React, { useState } from 'react';
import { Modal, Form, Upload, Button, message, UploadProps } from 'antd';
import { InboxOutlined, LoadingOutlined } from '@ant-design/icons';
import { Student } from '../../../types/types';
import { uploadStudentImage } from '../../../services/studentService';

type EditPlayerProps = {
  visible: boolean;
  onCancel: () => void;
  student: Student;
  onSave: (updatedStudent: Student) => void;
};

const EditPlayer: React.FC<EditPlayerProps> = ({ visible, onCancel, student, onSave }) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('¡Solo puedes subir archivos JPG/PNG!');
      return Upload.LIST_IGNORE;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('¡La imagen debe ser menor a 2MB!');
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
      const filename = await uploadStudentImage(localStorage.getItem('token')!, student.id, imageFile);
      if (!filename) throw new Error('Error al subir la imagen');

      const photoUrl = `${process.env.REACT_APP_BASE_URL}/static/${filename}`;
      const updatedStudent = { ...student, photoUrl };

      message.success('Imagen actualizada exitosamente!');
      onSave(updatedStudent);
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

  return (
    <Modal
      visible={visible}
      title="Subir imagen del jugador"
      footer={null}
      onCancel={onCancel}
    >
      <Form layout="vertical">
        <Form.Item style={{ textAlign: 'center' }}>
          <Upload.Dragger
            name="file"
            multiple={false}
            fileList={[]}
            listType="picture-card"
            beforeUpload={beforeUpload}
            onChange={handleChange}
            showUploadList={false}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
            ) : (
              <div>
                {loading ? <LoadingOutlined /> : <InboxOutlined />}
                <div style={{ marginTop: 8 }}>Haz clic o arrastra un archivo a esta área</div>
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

export default EditPlayer;
