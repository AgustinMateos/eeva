'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  Table,Pagination, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress,
  Button, Dialog, DialogActions, DialogContent,PaginationItem, DialogTitle, TextField, MenuItem, Box, IconButton, TableBody
} from '@mui/material';

export default function RolesPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dni: '',
    phoneNumber: '',
    role: 'USER',
  });

  const handleEditUser = (user) => {
    setFormData({
      _id: user._id, // Asegúrate de incluir el _id al editar
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '', // No queremos pre-poblar la contraseña
      dni: user.dni,
      phoneNumber: user.phoneNumber,
      role: user.role?.id || '', // Asumimos que el role contiene un ID
    });
    setOpen(true);
  };


  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const response = await axios.get('https://api-bando.vercel.app/api/v1/roles/userCompanies', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRoles(response.data.rolesCompany); // Asume que la respuesta tiene 'rolesCompany'
      } catch (err) {
        console.error('Error al obtener roles:', err);
      }
    };

    fetchRoles();
  }, []);


  const getToken = () => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1] || null;
  };

  const getCompanyId = () => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('company='))
      ?.split('=')[1] || null;
  };

  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      const idCompany = getCompanyId();
      if (!token || !idCompany) {
        router.push('/login');
        return;
      }
  
      try {
        const response = await axios.get('https://api-bando.vercel.app/api/v1/userCompanies/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data.userInCompany || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        if (err.response?.status === 401) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [refreshTrigger]); // Se ejecuta cada vez que cambia refreshTrigger
  

  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const usersPerPage = 4; // Definir el número máximo de usuarios por página

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async () => {
    const token = getToken();
    const idCompany = getCompanyId();
  
    if (!token || !idCompany) {
      router.push('/login');
      return;
    }
  
    try {
      const response = await axios.post(
        `https://api-bando.vercel.app/api/v1/userCompanies/create/${idCompany}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.data?.user) {
        setRefreshTrigger(prev => !prev); // Forzar actualización
      }
  
      setOpen(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        dni: '',
        phoneNumber: '',
        role: '',
      });
  
    } catch (err) {
      console.error('Error al crear usuario:', err.response?.data || err.message);
    }
  };
  const handleDeleteUser = async (userId) => {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }
  
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este usuario?');
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`https://api-bando.vercel.app/api/v1/userCompanies/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setRefreshTrigger(prev => !prev); // Forzar actualización
    } catch (err) {
      console.error('Error al eliminar usuario:', err.response?.data || err.message);
    }
  };

  const handleUpdateUser = async () => {
    const token = getToken();
    const userId = formData._id;
  
    if (!formData.role) {
      alert('Debe seleccionar un rol para el usuario.');
      return;
    }
  
    if (!token) {
      router.push('/login');
      return;
    }
  
    try {
      const response = await axios.patch(
        `https://api-bando.vercel.app/api/v1/userCompanies/${userId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.data?.user) {
        setRefreshTrigger(prev => !prev); // Forzar actualización
      }
  
      setOpen(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        dni: '',
        phoneNumber: '',
        role: '',
      });
  
    } catch (err) {
      console.error('Error al actualizar usuario:', err.response?.data || err.message);
    }
  };






  return (
    

    <Box sx={{ backgroundColor: "#FFFFFF", padding: [5], borderRadius: '30px',width:'1150px' }}>

  <h2 justifyContent="flex-start" className="text-xl flex font-bold mb-4">Roles</h2>

  <Box display="flex" justifyContent="flex-end" mb={2}>
    <Button
      variant="contained"
      sx={{
        backgroundColor: 'black',
        '&:hover': {
          backgroundColor: '#1DAC92', // Color de fondo cuando el cursor pasa sobre el botón
        }
      }}
      onClick={() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          dni: '',
          phoneNumber: '',
          role: 'USER',
        });
        setOpen(true);
      }}
    >
      Agregar Usuario
    </Button>
  </Box>

  {loading ? (
  <Box display="flex" justifyContent="center" alignItems="center" height="300px">
    <CircularProgress sx={{ color: '#119881' }} />
  </Box>
) : users.length === 0 ? (
  <p>No hay usuarios disponibles.</p>
) : (
  <TableContainer component={Paper} sx={{ boxShadow: "none" }}> 
    <Table>

      <TableHead>
  <TableRow>
    <TableCell sx={{ backgroundColor: "#EBEBEB" }}><strong>ID</strong></TableCell>
    <TableCell sx={{ backgroundColor: "#EBEBEB" }}><strong>Nombre</strong></TableCell>
    <TableCell sx={{ backgroundColor: "#EBEBEB" }}><strong>Rol</strong></TableCell>
    <TableCell sx={{ backgroundColor: "#EBEBEB" }}><strong>Dni</strong></TableCell>
    <TableCell sx={{ backgroundColor: "#EBEBEB" }}><strong>Email</strong></TableCell>
    <TableCell sx={{ backgroundColor: "#EBEBEB" }}><strong>Phone Number</strong></TableCell>
    <TableCell sx={{ backgroundColor: "#EBEBEB" }}><strong>Configuracion</strong></TableCell>
  </TableRow>
</TableHead>

<TableBody>
  {currentUsers?.filter(user => user?._id).map((user, index) => (
    <TableRow 
      key={user._id}
      sx={{
        backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#BDEFE7', // Alterna entre azul y verde
        color: 'white', // Asegura que el texto sea visible
      }}
    >
      <TableCell>{user._id}</TableCell>
      <TableCell>{user.firstName} {user.lastName}</TableCell>
      <TableCell>{user.role?.name || "Sin rol"}</TableCell>
      <TableCell>{user.dni}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.phoneNumber}</TableCell>
      <TableCell>
        <IconButton onClick={() => handleEditUser(user)} aria-label="editar">
          <img src="/generales/edit.svg" alt="Editar" style={{ width: 24, height: 24 }} />
        </IconButton>

        <IconButton
          onClick={() => handleDeleteUser(user._id)}
          aria-label="eliminar"
          style={{ marginLeft: '8px' }}
        >
          <img src="/generales/trash.svg" alt="Eliminar" style={{ width: 24, height: 24 }} />
        </IconButton>
      </TableCell>
    </TableRow>
  ))}
</TableBody>




      </Table>
    </TableContainer>
  )}
  <Box display="flex" justifyContent="center" mt={2}>
  <Pagination
    count={Math.ceil(users.length / usersPerPage)} // Calcular el número de páginas
    page={currentPage}
    onChange={(e, page) => setCurrentPage(page)} // Cambiar la página
   
    siblingCount={1} // Número de páginas vecinas a mostrar antes y después de la página actual
    boundaryCount={1} // Mostrar las primeras y últimas páginas
    renderItem={(item) => (
      item.page === 1 || item.page === Math.ceil(users.length / usersPerPage) || 
      (Math.abs(currentPage - item.page) <= 1) ? (
        <PaginationItem {...item} />
      ) : (
        <PaginationItem {...item} disabled>
          <span >...</span>
        </PaginationItem>
      )
    )}
  />
</Box>


  <Dialog open={open} onClose={() => setOpen(false)}>
    {/* Título dinámico dependiendo si estamos creando o editando */}
    <DialogTitle>{formData._id ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}</DialogTitle>

    <DialogContent>
      <TextField
        fullWidth
        margin="dense"
        label="Nombre"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="dense"
        label="Apellido"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="dense"
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="dense"
        label="Contraseña"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="dense"
        label="DNI"
        name="dni"
        value={formData.dni}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        margin="dense"
        label="Teléfono"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
      />

      <TextField
        select
        fullWidth
        margin="dense"
        label="Rol"
        name="role"
        value={formData.role}
        onChange={handleChange}
      >
        {roles.map((role) => (
          <MenuItem key={role.id} value={role.id}>
            {role.name}
          </MenuItem>
        ))}
      </TextField>
    </DialogContent>

    <DialogActions>
      <Button onClick={() => setOpen(false)} color="primary">
        Cancelar
      </Button>

      <Button
        onClick={formData._id ? handleUpdateUser : handleCreateUser}
        color="primary"
        variant="contained"
        disabled={!formData.role} // Deshabilita el botón si el rol está vacío
      >
        {formData._id ? 'Actualizar' : 'Crear'}
      </Button>
    </DialogActions>
  </Dialog>
</Box>

  );
}





// 'use client';
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// export default function TestFetch() {
//   const [campaigns, setCampaigns] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const router = useRouter(); 

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!router) return; // Asegurar que router está disponible antes de usarlo

//       try {
//         setLoading(true);

//         let token = null;
//         if (typeof window !== 'undefined') {
//           token = document.cookie
//             .split('; ')
//             .find(row => row.startsWith('token='))
//             ?.split('=')[1];
//         }

//         if (!token) {
//           router.push('/login');
//           return;
//         }

//         const response = await axios.get('https://api-bando.vercel.app/api/v1/usersCompanies/users', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.data && Array.isArray(response.data)) {
//           setCampaigns(response.data);
//         } else {
//           throw new Error('Respuesta inesperada de la API');
//         }

//         console.log('Data from API:', response.data);
//       } catch (err) {
//         setError(err);
//         console.error('Error fetching data:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [router]);

//   if (error) return <div>Error al obtener datos</div>;

//   return <div>consola</div>;
// }