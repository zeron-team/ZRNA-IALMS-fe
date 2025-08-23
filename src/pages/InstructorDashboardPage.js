// frontend/src/pages/InstructorDashboardPage.js

import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../auth/AuthContext';
import { FaChalkboardTeacher, FaUsers, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { 
    Box, Typography, Grid, Card, Paper, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Collapse, IconButton, Container
} from '@mui/material';
import CourseCard from '../components/CourseCard';
import '../styles/InternalPageHeader.css'; // Corrected import path

const StudentRow = ({ student }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <TableRow onClick={() => setIsOpen(!isOpen)} sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}>
                <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton size="small">
                            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                        </IconButton>
                        <Typography variant="body1" fontWeight="bold">{student.student_name}</Typography>
                    </Box>
                </TableCell>
                <TableCell>{student.enrollments.length}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Detalles de Inscripción
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Sala</TableCell>
                                        <TableCell>Curso</TableCell>
                                        <TableCell>Progreso</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {student.enrollments.map((enrollment, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{enrollment.room_name}</TableCell>
                                            <TableCell>{enrollment.course_title}</TableCell>
                                            <TableCell>{enrollment.progress}%</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

const InstructorDashboardPage = () => {
    const [dashboardData, setDashboardData] = useState({ courses: [], room_summary: [] }); // Initialize with empty courses array
    const [detailedProgress, setDetailedProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        Promise.all([
            api.getInstructorDashboard(),
            api.getInstructorDetailedProgress()
        ]).then(([dashboardData, progressData]) => {
            setDashboardData(dashboardData);
            setDetailedProgress(progressData);
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    if (loading) return <Typography sx={{ textAlign: 'center', mt: 4 }}>Cargando dashboard de instructor...</Typography>;
    if (!dashboardData) return <Typography sx={{ textAlign: 'center', mt: 4 }}>No se pudieron cargar los datos.</Typography>;

    const totalRooms = dashboardData.room_summary.length;
    const totalStudents = detailedProgress.length;

    return (
        <div className="landing-container">
            <div className="internal-hero-section"> {/* Changed class name */}
                <Container maxWidth="md">
                    <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem' }, fontWeight: 'bold' }}>
                        Dashboard de Instructor
                    </Typography>
                    <p>Gestiona tus cursos, salas y estudiantes.</p>
                </Container>
            </div>

            <Box sx={{ py: 8 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6}>
                            <Card className="feature-card" sx={{ height: '100%' }}>
                                <FaChalkboardTeacher size={40} color="#2196F3" />
                                <Typography variant="h5">{totalRooms}</Typography>
                                <Typography color="text.secondary">Salas Creadas</Typography>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Card className="feature-card" sx={{ height: '100%' }}>
                                <FaUsers size={40} color="#2196F3" />
                                <Typography variant="h5">{totalStudents}</Typography>
                                <Typography color="text.secondary">Alumnos Totales</Typography>
                            </Card>
                        </Grid>
                    </Grid>

                    <Box sx={{ my: 4 }}>
                        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Mis Cursos
                        </Typography>
                        <Grid container spacing={4}>
                            {dashboardData.courses && dashboardData.courses.length > 0 ? (
                                dashboardData.courses.map(course => (
                                    <Grid item key={course.id} xs={12} sm={6} md={4}>
                                        <CourseCard course={course} />
                                    </Grid>
                                ))
                            ) : (
                                <Grid item xs={12}>
                                    <Typography>No tienes cursos para mostrar.</Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Box>

                    <Grid container spacing={4} sx={{ mt: 4 }}>
                        <Grid item xs={12} md={6}>
                            <Card sx={{ p: 2 }}>
                                <Typography variant="h6" component="h3" gutterBottom>Gestión de Salas</Typography>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Nombre de la Sala</TableCell>
                                                <TableCell>Nº de Alumnos</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {dashboardData.room_summary.map(room => (
                                                <TableRow key={room.id}>
                                                    <TableCell>{room.name}</TableCell>
                                                    <TableCell>{room.member_count}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card sx={{ p: 2 }}>
                                <Typography variant="h6" component="h3" gutterBottom>Seguimiento Detallado de Alumnos</Typography>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Alumno</TableCell>
                                                <TableCell>Cursos Totales</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {detailedProgress.map(student => (
                                                <StudentRow key={student.student_id} student={student} />
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </div>
    );
};

export default InstructorDashboardPage;