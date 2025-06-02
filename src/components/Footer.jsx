'use client'; // Mark this component as client-side

import React from 'react';
import { Grid, Card, CardContent, Typography, Box, MenuItem, Select, FormControl, LinearProgress } from '@mui/material';
import dynamic from 'next/dynamic';

// Dynamically import chart components to disable SSR
const Pie = dynamic(() => import('react-chartjs-2').then((mod) => mod.Pie), { ssr: false });
const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), { ssr: false });
const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), { ssr: false });
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale, Filler, BarElement } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale, Filler, BarElement);

const Inicio = () => {
  // Data for Pie Chart (Kilómetros por zona de campaña)
  const pieData = {
    labels: ['Zona 1', 'Zona 2', 'Zona 3'],
    datasets: [
      {
        data: [452, 357, 294],
        backgroundColor: ['#0288D1', '#4FC3F7', '#B3E5FC'],
        borderWidth: 1,
        borderColor: '#fff',
      },
    ],
  };

  const pieOptions = {
    cutout: '50%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  // Data for Line Chart (Total de impresiones)
  const lineData = {
    labels: ['Día 1', 'Día 2', 'Día 3', 'Día 4', 'Día 5'],
    datasets: [
      {
        label: 'Cantidad de vistas',
        data: [200, 220, 257, 230, 210],
        borderColor: '#FF9800',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, 'rgba(255, 152, 0, 0.2)');
          gradient.addColorStop(1, 'rgba(255, 152, 0, 0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: (context) => {
          const index = context.dataIndex;
          return index === 2 ? '#FF9800' : 'rgba(0, 0, 0, 0)';
        },
        pointRadius: (context) => {
          const index = context.dataIndex;
          return index === 2 ? 5 : 0;
        },
        pointHoverRadius: 6,
        pointStyle: 'circle',
      },
    ],
  };

  const lineOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => `${context.raw} vistas`,
        },
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
        beginAtZero: true,
      },
    },
    elements: {
      line: {
        borderWidth: 2,
      },
    },
  };

  // Data for Bar/Line Chart (Kilómetros recorridos por usuarios)
  const barLineData = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Dom', 'Sáb'],
    datasets: [
      {
        type: 'bar',
        label: 'Este mes',
        data: [400, 300, 250, 500, 350, 300, 150],
        backgroundColor: '#119881', // Dark teal for "Este mes"
        borderColor: '#119881',
        borderWidth: 1,
        barThickness: 20,
      },
      {
        type: 'line',
        label: 'Tendencia Este mes',
        data: [400, 300, 250, 500, 350, 300, 150], // Same as bar data to align with bar tops
        borderColor: '#119881',
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.3,
        pointRadius: 3,
        pointBackgroundColor: '#119881',
        pointBorderColor: '#119881',
      },
      {
        type: 'bar',
        label: 'Mes pasado',
        data: [250, 200, 150, 450, 300, 200, 100],
        backgroundColor: '#9FECDE', // Light teal for "Mes pasado"
        borderColor: '#9FECDE',
        borderWidth: 1,
        barThickness: 20,
      },
      {
        type: 'line',
        label: 'Tendencia Mes pasado',
        data: [250, 200, 150, 450, 300, 200, 100], // Same as bar data to align with bar tops
        borderColor: '#9FECDE',
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.3,
        pointRadius: 3,
        pointBackgroundColor: '#9FECDE',
        pointBorderColor: '#9FECDE',
      },
    ],
  };

  const barLineOptions = {
    plugins: {
      legend: {
        position: 'top',
        align: 'start',
        labels: {
          boxWidth: 10,
          padding: 20,
          font: {
            size: 12,
          },
          filter: (legendItem) => !legendItem.text.includes('Tendencia'),
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw} Km`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        max: 700,
        ticks: {
          stepSize: 100,
        },
      },
    },
  };

  // Data for New Line Chart (Total de impresiones por día)
  const impressionsLineData = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Dom', 'Sáb'],
    datasets: [
      {
        label: 'Este mes',
        data: [1200, 900, 750, 1500, 1050, 900, 450],
        borderColor: '#119881',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(17, 152, 129, 0.2)'); // Light teal fill
          gradient.addColorStop(1, 'rgba(17, 152, 129, 0)');
          return gradient;
        },
        fill: true,
        tension: 0.3,
        pointRadius: 3,
        pointBackgroundColor: '#119881',
        pointBorderColor: '#119881',
      },
      {
        label: 'Mes pasado',
        data: [750, 600, 450, 1350, 900, 600, 300],
        borderColor: '#9FECDE',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(159, 236, 222, 0.2)'); // Light teal fill
          gradient.addColorStop(1, 'rgba(159, 236, 222, 0)');
          return gradient;
        },
        fill: true,
        tension: 0.3,
        pointRadius: 3,
        pointBackgroundColor: '#9FECDE',
        pointBorderColor: '#9FECDE',
      },
    ],
  };

  const impressionsLineOptions = {
    plugins: {
      legend: {
        position: 'top',
        align: 'start',
        labels: {
          boxWidth: 10,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw} impresiones`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        max: 2000,
        ticks: {
          stepSize: 500,
        },
      },
    },
    elements: {
      line: {
        borderWidth: 2,
      },
    },
  };

  // Calculate the maximum value for scaling the progress bars
  const maxKm = Math.max(...pieData.datasets[0].data);

  return (
    <Box sx={{ padding: 3 }}>
      {/* Header with Filters */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Campañas</Typography>
        <Box>
          <FormControl sx={{ mr: 1, minWidth: 120 }}>
            <Select defaultValue="Seleccionar Fecha">
              <MenuItem value="Seleccionar Fecha">Seleccionar Fecha</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ mr: 1, minWidth: 120 }}>
            <Select defaultValue="Marcas">
              <MenuItem value="Marcas">Marcas</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <Select defaultValue="Campañas">
              <MenuItem value="Campañas">Campañas</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">08</Typography>
              <Typography variant="body2">Total de Campañas</Typography>
              <Typography variant="caption" color="green">
                ↑ 0,7% <span style={{ color: 'grey' }}>+0,2% el mes pasado</span>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">1503</Typography>
              <Typography variant="body2">Total de Vehículos</Typography>
              <Typography variant="caption" color="green">
                ↑ 10,03% <span style={{ color: 'grey' }}>-2,49% el mes pasado</span>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">937.792</Typography>
              <Typography variant="body2">Total de Impresiones</Typography>
              <Typography variant="caption" color="green">
                ↑ 1,6% <span style={{ color: 'grey' }}>-0,91% este mes</span>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">$9.845</Typography>
              <Typography variant="body2">Costo por Impresión</Typography>
              <Typography variant="caption" color="green">
                ↑ 5,4% <span style={{ color: 'grey' }}>+2,51% este mes</span>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">16.230 Km</Typography>
              <Typography variant="body2">Kms totales recorridos</Typography>
              <Typography variant="caption" color="green">
                ↑ 5,7% <span style={{ color: 'grey' }}>+0,2% el mes pasado</span>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">4.240 m</Typography>
              <Typography variant="body2">Kms sin costo recorridos</Typography>
              <Typography variant="caption" color="red">
                ↓ 2,01% <span style={{ color: 'grey' }}>-1,49% el mes pasado</span>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">410 Km</Typography>
              <Typography variant="body2">Kms promedio por vehículo</Typography>
              <Typography variant="caption" color="green">
                ↑ 1,6% <span style={{ color: 'grey' }}>-0,91% este mes</span>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Kilómetros por zona de campaña</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Box sx={{ width: '50%', height: 200 }}>
                  <Pie data={pieData} options={pieOptions} />
                </Box>
                <Box sx={{ width: '50%', pl: 2 }}>
                  {pieData.labels.map((label, index) => {
                    const value = pieData.datasets[0].data[index];
                    const color = pieData.datasets[0].backgroundColor[index];
                    return (
                      <Box key={label} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            backgroundColor: color,
                            mr: 1,
                          }}
                        />
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          {label}
                        </Typography>
                        <Box sx={{ flexGrow: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={(value / maxKm) * 100}
                            sx={{
                              height: 10,
                              borderRadius: 5,
                              backgroundColor: '#E0E0E0',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: color,
                              },
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {value} Km
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total de Impresiones</Typography>
              <Typography variant="body2" color="text.secondary">
                Cantidad de vistas
              </Typography>
              <Typography variant="h6" color="text.primary">
                257
              </Typography>
              <Box sx={{ height: 200, position: 'relative' }}>
                <Line data={lineData} options={lineOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart: Kilómetros recorridos por usuarios */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="h6">Kilómetros recorridos por usuarios</Typography>
                  <Typography variant="caption" color="green">
                    ↑ 12,04% vs mes pasado
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Datos tomados desde 01 de May, 2024
                  </Typography>
                </Box>
                <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                  Ver reporte
                </Typography>
              </Box>
              <Box sx={{ height: 300 }}>
                <Bar data={barLineData} options={barLineOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* New Chart: Total de impresiones por día */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="h6">Total de impresiones por día</Typography>
                  <Typography variant="caption" color="green">
                    ↑ 12,04% vs mes pasado
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Datos tomados desde 01 de May, 2024
                  </Typography>
                </Box>
                <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                  Ver reporte
                </Typography>
              </Box>
              <Box sx={{ height: 300 }}>
                <Line data={impressionsLineData} options={impressionsLineOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Inicio;