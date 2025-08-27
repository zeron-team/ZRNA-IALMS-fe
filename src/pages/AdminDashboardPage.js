// frontend/src/pages/AdminDashboardPage.js

import React, { useState, useEffect } from 'react';
import { api } from '../services/api'; // Fixed syntax error
import { FaUsers, FaBook, FaUserCheck, FaLayerGroup, FaChalkboard, FaChevronDown, FaFaChevronUp, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { 
    Box, Typography, Grid, Card, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Collapse, IconButton, Container, Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import '../styles/InternalPageHeader.css'; // Corrected import path

const CourseRow = ({ course }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <TableRow onClick={() => setIsOpen(!isOpen)} sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}>
                <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton size="small">
                            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                        </IconButton>
                        <Typography variant="body1" fontWeight="bold">{course.title}</Typography>
                    </Box>
                </TableCell>
                <TableCell>{course.enrolled_students.length}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Estudiantes Inscritos
                            </Typography>
                            <Table size="small" aria-label="students">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Alumno</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Progreso</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {course.enrolled_students.map(student => (
                                        <tr key={student.id}>
                                            <td>{student.name}</td>
                                            <td>{student.email}</td>
                                            <td>{student.progress}%</td>
                                        </tr>
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

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [roomsSummary, setRoomsSummary] = useState([]);
  const [globalRatingCounts, setGlobalRatingCounts] = useState({ upvotes: 0, downvotes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getDashboardStats(),
      api.getEnrollmentsWithProgress(),
      api.getAllRoomsSummary(),
      api.getGlobalRatingCounts()
    ])
    .then(([statsData, enrollmentsData, roomsData, globalRatingData]) => {
      setStats(statsData);
      setEnrollments(enrollmentsData);
      setRoomsSummary(roomsData);
      setGlobalRatingCounts(globalRatingData);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  }, []);

  if (loading) return <Typography sx={{ textAlign: 'center', mt: 4 }}>Cargando dashboard...</Typography>;

  const statItems = stats ? [
    { icon: <FaUsers size={40} color="#2196F3" />, label: 'Usuarios Totales', value: stats.total_users },
    { icon: <FaBook size={40} color="#4CAF50" />, label: 'Cursos Totales', value: stats.total_courses },
    { icon: <FaUserCheck size={40} color="#FFC107" />, label: 'Inscripciones Totales', value: stats.total_enrollments },
    { icon: <FaLayerGroup size={40} color="#00BCD4" />, label: 'Categorías Totales', value: stats.total_categories },
    { icon: <FaChalkboard size={40} color="#F44336" />, label: 'Salas Totales', value: roomsSummary.length },
    { icon: <FaThumbsUp size={40} color="green" />, label: 'Votos Positivos', value: globalRatingCounts.upvotes },
    { icon: <FaThumbsDown size={40} color="red" />, label: 'Votos Negativos', value: globalRatingCounts.downvotes },
  ] : [];

  return (
    <div className="landing-container">
        <div className="internal-hero-section"> {/* Changed class name */}
            <Container maxWidth="md">
                <Typography variant="h4" component="h1" sx={{ fontSize: { xs: '1.8rem', sm: '2.5rem' }, fontWeight: 'bold' }}>
                    Dashboard de Administración
                </Typography>
                <p>Supervisa y gestiona la plataforma.</p>
            </Container>
        </div>

        <Box sx={{ py: 8 }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {statItems.map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                            <Card sx={{ 
                                height: '100%', 
                                p: 3, 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                textAlign: 'center',
                                boxShadow: 3, 
                                borderRadius: 2, 
                                transition: 'transform 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-5px)', 
                                    boxShadow: 6,
                                }
                            }}>
                                {item.icon}
                                <Typography variant="h4" component="h2" sx={{ mt: 2, mb: 1, fontWeight: 'bold'}}>{item.value}</Typography>
                                <Typography variant="subtitle1" color="text.secondary">{item.label}</Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ my: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button component={Link} to="/admin/users" variant="contained" size="large">Gestionar Usuarios</Button>
                    <Button component={Link} to="/admin/courses" variant="contained" size="large">Gestionar Cursos</Button>
                </Box>

                <Grid container spacing={4} sx={{ mt: 4 }}>
                    <Grid item xs={12} lg={6}>
                        <Card sx={{ p: 2, height: '100%' }}>
                            <Typography variant="h6" component="h3" gutterBottom>Supervisión de Salas</Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Nombre de la Sala</TableCell>
                                            <TableCell>Instructor</TableCell>
                                            <TableCell>Cursos</TableCell>
                                            <TableCell>Alumnos</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {roomsSummary.map(room => (
                                            <TableRow key={room.id}>
                                                <TableCell>{room.name}</TableCell>
                                                <TableCell>{room.instructor_name}</TableCell>
                                                <TableCell>{room.course_count}</TableCell>
                                                <TableCell>{room.member_count}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Card>
                    </Grid>

                    <Grid item xs={12} lg={6}>
                        <Card sx={{ p: 2, height: '100%' }}>
                            <Typography variant="h6" component="h3" gutterBottom>Inscripciones por Curso</Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Título del Curso</TableCell>
                                            <TableCell>Inscritos</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {enrollments.map(course => (
                                            <CourseRow key={course.id} course={course}/>
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

export default AdminDashboardPage;