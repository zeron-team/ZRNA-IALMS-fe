// frontend/src/pages/RoomDetailPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../auth/AuthContext';
import { FaWhatsapp, FaTelegram, FaClipboard, FaPlusCircle, FaTrash, FaEdit } from 'react-icons/fa';
import { 
    Box, Typography, Container, Grid, Button, Paper, TextField, 
    Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, IconButton, Card, CardContent
} from '@mui/material';
import '../styles/InternalPageHeader.css'; // Corrected import path

const AddCourseModal = ({ availableCourses, onAdd, onClose }) => (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Añadir Curso a la Sala</DialogTitle>
        <DialogContent dividers>
            <List>
                {availableCourses.length > 0 ? availableCourses.map(course => (
                    <ListItem key={course.id} secondaryAction={
                        <IconButton edge="end" onClick={() => onAdd(course.id)}>
                            <FaPlusCircle />
                        </IconButton>
                    }>
                        <ListItemText primary={course.title} />
                    </ListItem>
                )) : <Typography>No tienes más cursos para añadir.</Typography>}
            </List>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cerrar</Button>
        </DialogActions>
    </Dialog>
);

const AddMemberModal = ({ availableUsers, onAdd, onClose }) => (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Invitar Estudiante a la Sala</DialogTitle>
        <DialogContent dividers>
            <List>
                {availableUsers.length > 0 ? availableUsers.map(user => (
                    <ListItem key={user.id} secondaryAction={
                        <IconButton edge="end" onClick={() => onAdd(user.id)}>
                            <FaPlusCircle />
                        </IconButton>
                    }>
                        <ListItemText primary={`${user.username} (${user.email})`} />
                    </ListItem>
                )) : <Typography>No hay más estudiantes para invitar.</Typography>}
            </List>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cerrar</Button>
        </DialogActions>
    </Dialog>
);

const EditRoomModal = ({ room, onSave, onClose }) => {
    const [name, setName] = useState(room.name);
    const [description, setDescription] = useState(room.description);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name, description });
    };

    return (
        <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Editar Sala</DialogTitle>
            <DialogContent dividers>
                <form onSubmit={handleSubmit}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nombre de la Sala"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Descripción"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSubmit} variant="contained">Guardar Cambios</Button>
            </DialogActions>
        </Dialog>
    );
};

const RoomDetailPage = () => {
    const { user } = useAuth();
    const [room, setRoom] = useState(null);
    const [myCourses, setMyCourses] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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

    const handleUpdateRoom = async (roomData) => {
        try {
            await api.updateRoom(id, roomData);
            setIsEditModalOpen(false);
            fetchDetails();
        } catch (error) {
            alert(`Error al actualizar la sala: ${error.message}`);
        }
    };

    const handleRemoveCourse = async (courseId) => {
        if (window.confirm("¿Seguro que quieres desasociar este curso de la sala?")) {
            try {
                await api.removeCourseFromRoom(id, courseId);
                fetchDetails();
            } catch (error) { alert(`Error: ${error.message}`); }
        }
    };

    const handleRemoveMember = async (userId) => {
        if (window.confirm("¿Seguro que quieres eliminar a este miembro de la sala?")) {
            try {
                await api.removeMemberFromRoom(id, userId);
                fetchDetails();
            } catch (error) { alert(`Error: ${error.message}`); }
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('¡Copiado al portapapeles!');
    };

    if (loading) return <Typography sx={{ textAlign: 'center', mt: 4 }}>Cargando sala...</Typography>;
    if (!room) return <Typography sx={{ textAlign: 'center', mt: 4 }}>Sala no encontrada.</Typography>;

    const isInstructor = user && user.id === room.instructor_id;
    const availableCourses = myCourses.filter(mc => !room.courses.some(rc => rc.id === mc.id));
    const availableUsers = allUsers.filter(au => !room.members.some(rm => rm.id === au.id));

    const joinLink = `https://zeronacademy.com/join?code=${room.join_code}`;
    const shareText = `¡Te invito a mi sala de aprendizaje "${room.name}" en Zeron Academy! Código: ${room.join_code}`;

    return (
        <div className="landing-container">
            <div className="internal-hero-section"> {/* Changed class name */}
                <Container maxWidth="md">
                    <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem' }, fontWeight: 'bold' }}>
                        {room.name}
                    </Typography>
                    <p>{room.description}</p>
                    {isInstructor && (
                        <Button
                            variant="contained"
                            size="large"
                            className="cta-button"
                            startIcon={<FaEdit />}
                            onClick={() => setIsEditModalOpen(true)}
                        >
                            Editar Sala
                        </Button>
                    )}
                </Container>
            </div>

            <Box sx={{ py: 8 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={8}>
                            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h5" component="h2" gutterBottom>Cursos en esta Sala</Typography>
                                    {isInstructor && (
                                        <Button variant="contained" startIcon={<FaPlusCircle />} onClick={() => setIsCourseModalOpen(true)}>
                                            Añadir Curso
                                        </Button>
                                    )}
                                </Box>
                                <Grid container spacing={2}>
                                    {room.courses.length > 0 ? (
                                        room.courses.map(course => (
                                            <Grid item xs={12} sm={6} md={4} key={course.id}>
                                                <Card sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                                                    <Typography>{course.title}</Typography>
                                                    {!isInstructor ? (
                                                        <Button onClick={() => navigate(`/course/${course.id}`)} variant="outlined" size="small">Empezar</Button>
                                                    ) : (
                                                        <IconButton edge="end" onClick={() => handleRemoveCourse(course.id)} color="error">
                                                            <FaTrash />
                                                        </IconButton>
                                                    )}
                                                </Card>
                                            </Grid>
                                        ))
                                    ) : (
                                        <Grid item xs={12}><Typography>No hay cursos en esta sala.</Typography></Grid>
                                    )}
                                </Grid>
                            </Paper>

                            {isInstructor && (
                                <Paper elevation={3} sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h5" component="h2" gutterBottom>Miembros</Typography>
                                        <Button variant="contained" startIcon={<FaPlusCircle />} onClick={() => setIsMemberModalOpen(true)}>
                                            Invitar Usuario
                                        </Button>
                                    </Box>
                                    <List>
                                        {room.members.length > 0 ? (
                                            room.members.map(member => (
                                                <ListItem key={member.id} secondaryAction={(
                                                    <IconButton edge="end" onClick={() => handleRemoveMember(member.id)} color="error">
                                                        <FaTrash />
                                                    </IconButton>
                                                )}>
                                                    <ListItemText primary={member.profile?.first_name || member.username} secondary={member.email} />
                                                </ListItem>
                                            ))
                                        ) : (
                                            <Typography>No hay miembros en esta sala.</Typography>
                                        )}
                                    </List>
                                </Paper>
                            )}
                        </Grid>

                        {isInstructor && (
                            <Grid item xs={12} md={4}>
                                <Paper elevation={3} sx={{ p: 3 }}>
                                    <Typography variant="h6" component="h3" gutterBottom>Código de Invitación</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, border: '1px solid #ccc', borderRadius: 1, p: 1 }}>
                                        <Typography variant="h6" sx={{ flexGrow: 1 }}>{room.join_code}</Typography>
                                        <IconButton onClick={() => copyToClipboard(room.join_code)} color="primary">
                                            <FaClipboard />
                                        </IconButton>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Comparte este código para que los estudiantes se unan.</Typography>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <IconButton href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" color="success">
                                            <FaWhatsapp />
                                        </IconButton>
                                        <IconButton href={`https://t.me/share/url?url=${encodeURIComponent(joinLink)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" color="info">
                                            <FaTelegram />
                                        </IconButton>
                                    </Box>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                </Container>
            </Box>

            {isCourseModalOpen && <AddCourseModal availableCourses={availableCourses} onAdd={handleAddCourse} onClose={() => setIsCourseModalOpen(false)} />}
            {isMemberModalOpen && <AddMemberModal availableUsers={availableUsers} onAdd={handleAddMember} onClose={() => setIsMemberModalOpen(false)} />}
            {isEditModalOpen && <EditRoomModal room={room} onSave={handleUpdateRoom} onClose={() => setIsEditModalOpen(false)} />}
        </div>
    );
};

export default RoomDetailPage;