import axios from "./axiosConfig";

// Añadir una nueva ruta
export const addRoute = (data) => axios.post("/route/add", { ...data });

// Editar una ruta existente
export const editRoute = (routeID, data) => axios.put(`/route/edit/${routeID}`, { ...data });

// Eliminar una ruta
export const deleteRoute = (routeID) => axios.delete(`/route/delete/${routeID}`);

// Obtener todas las rutas
export const getAllRoutes = () => axios.get("/route/list");

// Agregar un pedido a una ruta existente
export const addParcelToRoute = (routeID, parcelID) => axios.put(`/route/add-parcel/${routeID}`, { parcelId: parcelID });

// Asignar un mensajero a una ruta
export const assignMessenger = (routeID, messengerID) => axios.put(`/route/assign-messenger/${routeID}`, { biker: messengerID });
