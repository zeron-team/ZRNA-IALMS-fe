// frontend/src/pages/MyRoomsPage.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import InfoModal from '../components/InfoModal';
import '../styles/MyRoomPage.css';

const MyRoomsPage = () => {
    const { user } = useAuth();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [isCreating, setIsCreating] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [roomDescription, setRoomDescription] = useState('');
    const [modalInfo, setModalInfo] = useState({ isOpen: false, title: '', message: '' });

    const fetchRooms = () => {
        setLoading(true);
        api.getMyRooms()
            .then(setRooms)
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        if (!roomName) {
            setModalInfo({ isOpen: true, title: 'Campo Requerido', message: 'El nombre de la sala es obligatorio.' });
            return;
        }
        try {
            await api.createRoom({ name: roomName, description: roomDescription });
            setIsCreating(false);
            setRoomName('');
            setRoomDescription('');
            fetchRooms();
        } catch (error) {
            setModalInfo({
                isOpen: true,
                title: 'Límite Alcanzado',
                message: error.message
            });
        }
    };

    if (loading) return <div className="page-container"><p>Cargando tus salas...</p></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Mis Salas</h1>
                {user.role.name === 'instructor' && !isCreating && (
                    <button className="btn btn-primary" onClick={() => setIsCreating(true)}>
                        + Crear Nueva Sala
                    </button>
                )}
            </div>

            {isCreating && (
                <div className="page-panel room-creation-panel">
                    <form onSubmit={handleCreateRoom}>
                        <h2>Nueva Sala</h2>
                        <input
                            type="text"
                            placeholder="Nombre de la Sala"
                            value={roomName}
                            onChange={e => setRoomName(e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="Descripción de la Sala"
                            value={roomDescription}
                            onChange={e => setRoomDescription(e.target.value)}
                            rows="3"
                        />
                        <div className="room-creation-actions">
                            <button type="submit" className="btn btn-success">Guardar Sala</button>
                            <button type="button" onClick={() => setIsCreating(false)} className="btn btn-secondary">Cancelar</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="room-list">
                {rooms.length > 0 ? (
                    rooms.map(room => (
                        <div key={room.id} className="room-card" onClick={() => navigate(`/rooms/${room.id}`)}>
                            <h3>{room.name}</h3>
                            <p>{room.description}</p>
                        </div>
                    ))
                ) : (
                    !isCreating && <div className="page-panel"><p>Aún no has creado ninguna sala o no eres miembro de ninguna.</p></div>
                )}
            </div>

            {modalInfo.isOpen && (
                <InfoModal
                    title={modalInfo.title}
                    message={modalInfo.message}
                    onClose={() => setModalInfo({ isOpen: false, title: '', message: '' })}
                />
            )}
        </div>
    );
};

export default MyRoomsPage;