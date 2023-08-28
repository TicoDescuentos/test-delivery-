const express = require('express');
const { addRoute, editRoute, deleteRoute, getAllRoutes, assignMessenger, addParcelToRoute } = require('../controllers/route'); // Importar addParcelToRoute
const authMiddleware = require('../middlewares/authJwt.js');

const router = express.Router();

router.post('/add', authMiddleware, addRoute);            // Añadir una nueva ruta
router.put('/edit/:id', editRoute);                       // Editar una ruta existente
router.delete('/delete/:id', deleteRoute);                // Eliminar una ruta
router.get('/list', getAllRoutes);                        // Obtener todas las rutas
router.put('/add-parcel/:id', addParcelToRoute);          // Agregar un pedido a una ruta existente
router.put('/assign-messenger/:id', assignMessenger);     // Asignar un mensajero a una ruta

module.exports = router;
