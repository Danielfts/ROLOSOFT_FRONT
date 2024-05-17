import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, Form, Input, message, Upload, Descriptions, UploadProps } from 'antd';
import { LoadingOutlined, PlusOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

type NewsItem = {
  id: string;
  title: string;
  text: string;
  imageUrl: string;
};

type FileType = {
  uid: string;
  name: string;
  status?: string;
  url?: string;
  type: string;
  size: number;
  originFileObj?: File;
};

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img.originFileObj as File);
};

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([
    {
      id: '1',
      title: 'Lorem Ipsum',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      imageUrl: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
    },
    {
      id: '2',
      title: 'Lorem Ipsum',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      imageUrl: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
    },
    {
      id: '3',
      title: 'Lorem Ipsum',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      imageUrl: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [viewingNews, setViewingNews] = useState<NewsItem | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get('https://660d2bd96ddfa2943b33731c.mockapi.io/api/news');
      if (response.status === 200) {
        setNews((prevNews) => [...prevNews, ...response.data]);
      } else {
        message.error('Failed to fetch news');
      }
    } catch (error) {
      message.error('Error fetching news');
    }
  };

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const handleAddNews = async (values: any) => {
    try {
      const newNews = {
        title: values.title,
        text: values.text,
        imageUrl: imageUrl,
      };
      const response = await axios.post('https://660d2bd96ddfa2943b33731c.mockapi.io/api/news', newNews);
      if (response.status === 201) {
        message.success('News added successfully!');
        fetchNews();
        setIsModalVisible(false);
        form.resetFields();
        setImageUrl(undefined);
      } else {
        message.error('Failed to add news');
      }
    } catch (error) {
      message.error('Error adding news');
    }
  };

  const handleViewNews = (newsItem: NewsItem) => {
    setViewingNews(newsItem);
    setIsViewModalVisible(true);
  };

  const handleDeleteNews = async (newsId: string) => {
    try {
      const response = await axios.delete(`https://660d2bd96ddfa2943b33731c.mockapi.io/api/news/${newsId}`);
      if (response.status === 200) {
        message.success('News deleted successfully!');
        setNews((prevNews) => prevNews.filter(news => news.id !== newsId));
      } else {
        message.error('Failed to delete news');
      }
    } catch (error) {
      message.error('Error deleting news');
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>Publicar Nueva Noticia</Button>
      <div style={{ margin: "2%" }}></div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px' }}>
        {news.map((item) => (
          <Card
            key={item.id}
            title={item.title}
            cover={<img alt={item.title} src={item.imageUrl} />}
            style={{ width: 300 }}
            actions={[
              <EyeOutlined key="view" onClick={() => handleViewNews(item)} />,
              <DeleteOutlined key="delete" onClick={() => handleDeleteNews(item.id)} />,
            ]}
          >
            <p>{item.text.substring(0, 100)}...</p>
          </Card>
        ))}
      </div>
      <Modal
        title="Publicar Nueva Noticia"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddNews} layout="vertical">
          <Form.Item name="title" rules={[{ required: true, message: 'Por favor ingrese un titulo' }]}>
            <Input placeholder="Titulo" />
          </Form.Item>
          <Form.Item name="text" rules={[{ required: true, message: 'Por favor ingrese una descripción' }]}>
            <Input.TextArea placeholder="Descripción" rows={4} />
          </Form.Item>
          <Form.Item label="Subir Imagen: ">
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 10, span: 14 }}>
            <Button type="primary" htmlType="submit">Publicar</Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="View News"
        visible={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={null}
      >
        {viewingNews && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Title">{viewingNews.title}</Descriptions.Item>
            <Descriptions.Item label="Text">{viewingNews.text}</Descriptions.Item>
            <Descriptions.Item label="Image">
              <img src={viewingNews.imageUrl} alt={viewingNews.title} style={{ width: '100%' }} />
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default News;
