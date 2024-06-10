import React from 'react';
import { Modal, Descriptions, List, Avatar } from 'antd';
import { Match } from '../../../types/types';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';

interface MatchDetailsModalProps {
  isViewing: boolean;
  viewingMatch: Match | null;
  onCancel: () => void;
}

const MatchDetailsModal: React.FC<MatchDetailsModalProps> = ({ isViewing, viewingMatch, onCancel }) => {
  // Function to get player's avatar
  const getPlayerAvatar = (goal: any) => {
    const photoFileName = goal.photoFileName; // Using the photoFileName from the Goal type
    console.log('Goal photoFileName:', photoFileName); // Log the photoFileName
    const avatarUrl = photoFileName ? `${process.env.REACT_APP_BASE_URL}/static/${photoFileName}` : null;
    console.log('Constructed avatar URL:', avatarUrl); // Log the constructed URL

    return photoFileName
      ? <Avatar src={avatarUrl} />
      : <Avatar icon={<UserOutlined />} />;
  };

  return (
    <Modal
      title="Detalles del Partido"
      open={isViewing}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      {viewingMatch ? (
        <Descriptions bordered column={1}>
          {/* Team A Details */}
          <Descriptions.Item label="Equipo A">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                src={viewingMatch.teamA.shieldFileName ? `${process.env.REACT_APP_BASE_URL}/static/${viewingMatch.teamA.shieldFileName}` : undefined}
                icon={!viewingMatch.teamA.shieldFileName ? <UserOutlined /> : undefined}
              />
              <span style={{ marginLeft: 8 }}>{viewingMatch.teamA.name}</span>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Goles del Equipo A">
            {viewingMatch.teamA.goals.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={viewingMatch.teamA.goals}
                renderItem={(goal) => (
                  <List.Item key={goal.id}>
                    <List.Item.Meta
                      avatar={getPlayerAvatar(goal)}
                      title={`${goal.name} ${goal.lastName}`}
                      description={`Minuto: ${goal.minute}`}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div>No goals</div>
            )}
          </Descriptions.Item>

          {/* Team B Details */}
          <Descriptions.Item label="Equipo B">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                src={viewingMatch.teamB.shieldFileName ? `${process.env.REACT_APP_BASE_URL}/static/${viewingMatch.teamB.shieldFileName}` : undefined}
                icon={!viewingMatch.teamB.shieldFileName ? <UserOutlined /> : undefined}
              />
              <span style={{ marginLeft: 8 }}>{viewingMatch.teamB.name}</span>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Goles del Equipo B">
            {viewingMatch.teamB.goals.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={viewingMatch.teamB.goals}
                renderItem={(goal) => (
                  <List.Item key={goal.id}>
                    <List.Item.Meta
                      avatar={getPlayerAvatar(goal)}
                      title={`${goal.name} ${goal.lastName}`}
                      description={`Minuto: ${goal.minute}`}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div>No goals</div>
            )}
          </Descriptions.Item>

          {/* Match Dates */}
          <Descriptions.Item label="Fecha Inicio">
            {moment(viewingMatch.dateTimeStart).format('DD/MM/YYYY HH:mm')}
          </Descriptions.Item>
          <Descriptions.Item label="Fecha Fin">
            {moment(viewingMatch.dateTimeEnd).format('DD/MM/YYYY HH:mm')}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <div>No match selected</div>
      )}
    </Modal>
  );
};

export default MatchDetailsModal;
