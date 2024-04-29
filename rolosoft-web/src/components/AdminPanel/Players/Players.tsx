import { Button, Table, Modal, Input } from "antd";
import { useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

// Define a type for contact data
type Contact = {
  id: number;
  name: string;
  email: string;
  address: string;
};

function Players() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [dataSource, setDataSource] = useState<Contact[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      address: "1234 Main St",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      address: "5678 Market Ave",
    },
  ]);

  const columns = [
    {
      key: "1",
      title: "ID",
      dataIndex: "id",
      sorter: (a: Contact, b: Contact) => a.id - b.id,
    },
    {
      key: "2",
      title: "Name",
      dataIndex: "name",
      sorter: (a: Contact, b: Contact) => a.name.localeCompare(b.name),
    },
    {
      key: "3",
      title: "Email",
      dataIndex: "email",
    },
    {
      key: "4",
      title: "Address",
      dataIndex: "address",
    },
    {
      key: "5",
      title: "Actions",
      render: (record: Contact) => (
        <>
          <EditOutlined
            onClick={() => {
              onEditContact(record);
            }}
          />
          <DeleteOutlined
            onClick={() => {
              onDeleteContact(record);
            }}
            style={{ color: "red", marginLeft: 12 }}
          />
        </>
      ),
    },
  ];

  const onAddContact = () => {
    const randomNumber = Math.floor(Math.random() * 1000);
    const newContact: Contact = {
      id: randomNumber,
      name: "Contact " + randomNumber,
      email: "contact" + randomNumber + "@example.com",
      address: "New Address " + randomNumber,
    };
    setDataSource((prev) => [...prev, newContact]);
  };

  const onDeleteContact = (record: Contact) => {
    Modal.confirm({
      title: "Are you sure you want to delete this contact?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        setDataSource((prev) => prev.filter((contact) => contact.id !== record.id));
      },
    });
  };

  const onEditContact = (record: Contact) => {
    setIsEditing(true);
    setEditingContact({ ...record });
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingContact(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Button onClick={onAddContact}>Add New Contact</Button>
        <Table columns={columns} dataSource={dataSource} />
        <Modal
          title="Edit Contact"
          visible={isEditing}
          okText="Save"
          onCancel={resetEditing}
          onOk={() => {
            setDataSource((prev) =>
              prev.map((contact) =>
                contact.id === editingContact?.id ? editingContact : contact
              )
            );
            resetEditing();
          }}
        >
          <Input
            placeholder="Name"
            value={editingContact?.name}
            onChange={(e) =>
              setEditingContact((prev) =>
                prev ? { ...prev, name: e.target.value } : null
              )
            }
          />
          <Input
            placeholder="Email"
            value={editingContact?.email}
            onChange={(e) =>
              setEditingContact((prev) =>
                prev ? { ...prev, email: e.target.value } : null
              )
            }
          />
          <Input
            placeholder="Address"
            value={editingContact?.address}
            onChange={(e) =>
              setEditingContact((prev) =>
                prev ? { ...prev, address: e.target.value } : null
              )
            }
          />
        </Modal>
      </header>
    </div>
  );
}

export default Players;
