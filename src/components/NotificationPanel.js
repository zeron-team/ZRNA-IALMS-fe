// frontend/src/components/NotificationPanel.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import '../styles/NotificationPanel.css';

const NotificationPanel = ({ notifications, onClose, onRefresh }) => {
  const navigate = useNavigate();

  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
      await api.markNotificationAsRead(notification.id);
      onRefresh();
    }
    if (notification.link_url) {
      navigate(notification.link_url);
    }
    onClose();
  };

  return (
    <div className="notification-panel">
      <div className="panel-header">
        <h4>Notificaciones</h4>
      </div>
      <div className="notification-list">
        {notifications.length > 0 ? (
          notifications.map(notif => (
            <div
              key={notif.id}
              className={`notification-item ${!notif.is_read ? 'unread' : ''}`}
              onClick={() => handleNotificationClick(notif)}
            >
              <p>{notif.message}</p>
              <span className="timestamp">{new Date(notif.created_at).toLocaleString()}</span>
            </div>
          ))
        ) : (
          <p className="no-notifications">No tienes notificaciones nuevas.</p>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;