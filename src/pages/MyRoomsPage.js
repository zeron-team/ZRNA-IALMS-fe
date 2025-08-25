// frontend/src/pages/MyRoomsPage.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import InfoModal from '../components/InfoModal';
import RoomCard from '../components/RoomCard';
import { Box, Typography, Container, Grid, Button, TextField, Paper } from '@mui/material';
import { FaPlusCircle } from 'react-icons/fa';
import '../styles/InternalPageHeader.css'; // Corrected import path

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

    if (loading) return <Typography sx={{ textAlign: 'center', mt: 4 }}>Cargando tus salas...</Typography>;

    return (
        <div className="landing-container">
            <div className="internal-hero-section"> {/* Changed class name */}
                <Container maxWidth="md">
                    <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem' }, fontWeight: 'bold' }}>
                        Mis Salas
                    </Typography>
                    <p>Gestiona tus salas de aprendizaje.</p>
                    {user.role.name === 'instructor' && !isCreating && (
                        <Button
                            variant="contained"
                            size="large"
                            className="cta-button"
                            startIcon={<FaPlusCircle />}
                            onClick={() => setIsCreating(true)}
                        >
                            Crear Nueva Sala
                        </Button>
                    )}
                </Container>
            </div>

            <Box sx={{ py: 8 }}>
                <Container maxWidth="lg">
                    {isCreating && (
                        <Paper elevation={6} sx={{ p: 4, mb: 4, borderRadius: 3}}>
                            <Box> {/* Added Box to wrap Typography and form */}
                                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                                    Nueva Sala
                                </Typography>
                                <form onSubmit={handleCreateRoom}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="roomName"
                                        label="Nombre de la Sala"
                                        value={roomName}
                                        onChange={e => setRoomName(e.target.value)}
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        margin="normal"
                                        fullWidth
                                        id="roomDescription"
                                        label="Descripción de la Sala"
                                        multiline
                                        rows={3}
                                        value={roomDescription}
                                        onChange={e => setRoomDescription(e.target.value)}
                                        sx={{ mb: 3 }}
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                        <Button type="submit" variant="contained" color="primary">
                                            Guardar Sala
                                        </Button>
                                        <Button type="button" variant="outlined" onClick={() => setIsCreating(false)}>
                                            Cancelar
                                        </Button>
                                    </Box>
                                </form>
                            </Box>
                        </Paper>
                    )}

                    {rooms.length > 0 ? (
                        <Grid container spacing={4}>
                            {rooms.map(room => (
                                <Grid item key={room.id} xs={12} sm={6} md={4}>
                                    <RoomCard room={room} />
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        !isCreating && (
                            <Paper sx={{ p: 3, textAlign: 'center', mt: 4 }}>
                                <Typography variant="h6">
                                    Aún no has creado ninguna sala o no eres miembro de ninguna.
                                </Typography>
                            </Paper>
                        )
                    )}
                </Container>
            </Box>

            <InfoModal
                open={modalInfo.isOpen}
                title={modalInfo.title}
                message={modalInfo.message}
                onClose={() => setModalInfo({ isOpen: false, title: '', message: '' })}
            />
        </div>
    );
};

export default MyRoomsPage;