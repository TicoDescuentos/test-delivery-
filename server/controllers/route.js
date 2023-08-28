// controllers/route.js
const Route = require('../models/route');
const Parcel = require('../models/parcel'); // Importar el modelo de Parcela para referenciarlo

// Función para añadir una nueva ruta
const addRoute = async (req, res, next) => {
  try {
    const { routeID, province, parcels, timeSlot } = req.body;
    
    // Crea la nueva ruta y guarda en la base de datos
    const newRoute = new Route({ routeID, province, parcels, timeSlot });
    await newRoute.save();

    res.status(201).json({ success: true, message: 'Ruta creada con éxito', data: newRoute });
  } catch (error) {
    return next(error);
  }
};



// Función para editar una ruta existente
const editRoute = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { routeID, province, parcels, timeSlot, status } = req.body;

    const updatedRoute = await Route.findByIdAndUpdate(
      id, 
      { routeID, province, parcels, timeSlot, status }, 
      { new: true }
    );

    res.status(200).json({ success: true, message: 'Ruta actualizada con éxito', data: updatedRoute });
  } catch (error) {
    return next(error);
  }
};


// Función para eliminar una ruta
const deleteRoute = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    await Route.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Ruta eliminada con éxito' });
  } catch (error) {
    return next(error);
  }
};

// Función para listar todas las rutas
const getAllRoutes = async (req, res, next) => {
  try {
    const routes = await Route.find().populate('parcels');

    res.status(200).json({ success: true, data: routes });
  } catch (error) {
    return next(error);
  }
};

// Función para asignar un mensajero a una ruta
const assignMessenger = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { biker } = req.body;

    // Comprobar si el usuario es un mensajero
    const isShipper = await User.findById(biker);
    if (!isShipper.isShipper) {
      return res.status(400).json({ success: false, message: 'El usuario seleccionado no es un mensajero' });
    }

    const updatedRoute = await Route.findByIdAndUpdate(id, { biker }, { new: true });

    res.status(200).json({ success: true, message: 'Mensajero asignado con éxito', data: updatedRoute });
  } catch (error) {
    return next(error);
  }
};



// Función para agregar un pedido a una ruta existente
const addParcelToRoute = async (req, res, next) => {
  try {
    const { id } = req.params; // ID de la ruta
    const { parcelId } = req.body; // ID del pedido

    // Buscar la ruta por ID
    const route = await Route.findById(id);

    // Verificar si la ruta existe
    if (!route) {
      return res.status(404).json({ success: false, message: 'Ruta no encontrada' });
    }

    // Agregar el ID del pedido al array de pedidos de la ruta
    route.parcels.push(parcelId);

    // Guardar los cambios en la base de datos
    await route.save();

    res.status(200).json({ success: true, message: 'Pedido agregado a la ruta con éxito', data: route });
  } catch (error) {
    return next(error);
  }
};

// Exportar todas las funciones del controlador
module.exports = {
  addRoute,
  editRoute,
  deleteRoute,
  getAllRoutes,
  assignMessenger,
  addParcelToRoute // No olvides exportar la nueva función
};