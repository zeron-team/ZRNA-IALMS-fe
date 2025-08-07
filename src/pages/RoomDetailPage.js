// frontend/src/pages/RoomDetailPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../auth/AuthContext';
import { FaWhatsapp, FaTelegram, FaClipboard, FaPlusCircle } from 'react-icons/fa';
import '../styles/RoomDetailPage.css';

const AddCourseModal = ({ availableCourses, onAdd, onClose }) => (
    <div className="modal-backdrop">
        <div className="modal-content">
            <h2>Añadir Curso a la Sala</h2>
            <div className="item-selection-list">
                {availableCourses.length > 0 ? availableCourses.map(course => (
                    <div key={course.id} className="item-selection-item">
                        <span>{course.title}</span>
                        <button onClick={() => onAdd(course.id)} className="btn btn-primary">+</button>
                    </div>
                )) : <p>No tienes más cursos para añadir.</p>}
            </div>
            <div className="modal-actions">
                <button onClick={onClose} className="btn btn-secondary">Cerrar</button>
            </div>
        </div>
    </div>
);

const AddMemberModal = ({ availableUsers, onAdd, onClose }) => (
    <div className="modal-backdrop">
        <div className="modal-content">
            <h2>Invitar Estudiante a la Sala</h2>
            <div className="item-selection-list">
                {availableUsers.length > 0 ? availableUsers.map(user => (
                    <div key={user.id} className="item-selection-item">
                        <span>{user.username} ({user.email})</span>
                        <button onClick={() => onAdd(user.id)} className="btn btn-primary">+</button>
                    </div>
                )) : <p>No hay más estudiantes para invitar.</p>}
            </div>
            <div className="modal-actions">
                <button onClick={onClose} className="btn btn-secondary">Cerrar</button>
            </div>
        </div>
    </div>
);

const RoomDetailPage = () => {
    const { user } = useAuth();
    const [room, setRoom] = useState(null);
    const [myCourses, setMyCourses] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchDetails = useCallback(() => {
        setLoading(true);
        const promises = [api.getRoomDetail(id)];
        if (user && ['instructor', 'admin'].includes(user.role.name)) {
            promises.push(api.getMyTaughtCourses());
            promises.push(api.getUsers());
        }
        Promise.all(promises)
            .then(([roomData, coursesData = [], usersData = []]) => {
                setRoom(roomData);
                setMyCourses(coursesData);
                setAllUsers(usersData.filter(u => u.role.name === 'student'));
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id, user]);

    useEffect(() => {
        if (user) {
            fetchDetails();
        }
    }, [user, fetchDetails]);

    const handleAddCourse = async (courseId) => {
        try {
            await api.addCourseToRoom(id, courseId);
            fetchDetails();
        } catch (error) { alert(`Error al añadir el curso: ${error.message}`); }
    };

    const handleAddMember = async (userId) => {
        try {
            await api.addMemberToRoom(id, userId);
            fetchDetails();
        } catch (error) { alert(`Error al añadir miembro: ${error.message}`); }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('¡Copiado al portapapeles!');
    };

    if (loading) return <div className="page-container"><p>Cargando sala...</p></div>;
    if (!room) return <div className="page-container"><p>Sala no encontrada.</p></div>;

    const isInstructor = user && user.id === room.instructor_id;
    const availableCourses = myCourses.filter(mc => !room.courses.some(rc => rc.id === mc.id));
    const availableUsers = allUsers.filter(au => !room.members.some(rm => rm.id === au.id));

    const joinLink = `https://zeronacademy.com/join?code=${room.join_code}`;
    const shareText = `¡Te invito a mi sala de aprendizaje "${room.name}" en Zeron Academy! Código: ${room.join_code}`;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>{room.name}</h1>
                <Link to="/my-rooms" className="btn btn-secondary">&larr; Volver a Mis Salas</Link>
            </div>
            <div className="room-detail-grid">
                <div className="room-main-content">
                    <div className="page-panel">
                        <div className="panel-header">
                            <h2>Cursos en esta Sala</h2>
                            {isInstructor && (
                                <button onClick={() => setIsCourseModalOpen(true)} className="btn btn-primary"><FaPlusCircle /> Añadir Curso</button>
                            )}
                        </div>
                        <div className="item-list">
                            {room.courses.map(course => (
                                <div key={course.id} className="item-card room-course-item">
                                    <span>{course.title}</span>
                                    {!isInstructor && (
                                        <button onClick={() => navigate(`/course/${course.id}`)} className="btn btn-secondary">Empezar</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    {isInstructor && (
                        <div className="page-panel">
                            <div className="panel-header">
                                <h2>Miembros</h2>
                                <button onClick={() => setIsMemberModalOpen(true)} className="btn btn-primary"><FaPlusCircle /> Invitar Usuario</button>
                            </div>
                            <div className="item-list">
                                {room.members.map(member => <div key={member.id} className="item-card">{member.profile?.first_name || member.username}</div>)}
                            </div>
                        </div>
                    )}
                </div>
                {isInstructor && (
                    <div className="room-side-panel">
                        <div className="page-panel">
                            <h3>Código de Invitación</h3>
                            <div className="join-code-box">
                              <span>{room.join_code}</span>
                              <button onClick={() => copyToClipboard(room.join_code)} className="btn-icon"><FaClipboard /></button>
                            </div>
                            <p>Comparte este código para que los estudiantes se unan.</p>
                            <div className="share-buttons">
                              <a href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
                              <a href={`https://t.me/share/url?url=${encodeURIComponent(joinLink)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer"><FaTelegram /></a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {isCourseModalOpen && <AddCourseModal availableCourses={availableCourses} onAdd={handleAddCourse} onClose={() => setIsCourseModalOpen(false)} />}
            {isMemberModalOpen && <AddMemberModal availableUsers={availableUsers} onAdd={handleAddMember} onClose={() => setIsMemberModalOpen(false)} />}
        </div>
    );
};

export default RoomDetailPage;