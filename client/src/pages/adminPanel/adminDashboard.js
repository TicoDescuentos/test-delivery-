import React, { useContext, useEffect, useState } from "react";
import { Navbar, CreateRoutes } from "../../components";
import Cookies from "universal-cookie";
import { AppContext } from "../../contextApi/AppContext";
import { getAllRoutes, editRoute, deleteRoute, addRoute, addParcelToRoute, assignMessenger } from  "../../Apis/routes";

const AdminDashboard = () => {
  const { AppData, dispatch } = useContext(AppContext);
  const cookies = new Cookies();
  const [showCreateRouteModal, setShowCreateRouteModal] = useState(false);

  const fetchRoutes = async () => {
    try {
      const response = await getAllRoutes();
      dispatch({ type: "GET_ROUTES", payload: response.data.data });
    } catch (error) {
      console.log("Error al obtener las rutas:", error);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, [dispatch]);

  if (!cookies.get("user").isAdmin) {
    return <p>No tienes permiso para ver esta página</p>;
  }

  const handleAddRoute = async () => {
    const newData = {
      province: "Nueva Provincia",
      parcels: [],
    };

    try {
      await addRoute(newData);
    } catch (error) {
      console.log("Error al añadir la ruta:", error);
    }
  };

  const handleEditRoute = async (routeID) => {
    const newData = {
      province: "Nueva Provincia Actualizada",
    };

    try {
      await editRoute(routeID, newData);
    } catch (error) {
      console.log("Error al editar la ruta:", error);
    }
  };

  const handleDeleteRoute = async (routeID) => {
    try {
      await deleteRoute(routeID);
    } catch (error) {
      console.log("Error al eliminar la ruta:", error);
    }
  };

  const handleAddParcelToRoute = async (routeID, parcelID) => {
    try {
      await addParcelToRoute(routeID, parcelID);
    } catch (error) {
      console.log("Error al añadir parcela a la ruta:", error);
    }
  };

  const handleAssignMessenger = async (routeID, messengerID) => {
    try {
      await assignMessenger(routeID, messengerID);
    } catch (error) {
      console.log("Error al asignar mensajero:", error);
    }
  };

  const RouteTable = () => {
    return (
      <table className="AdminDashboard_content_table">
        <thead>
          <tr>
            <th>ID de Ruta</th>
            <th>Provincia</th>
            <th>Mensajero</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {AppData.routes?.map((route, index) => (
            <tr key={index}>
              <td>{route._id}</td>
              <td>{route.province}</td>
              <td>{route.biker?.first_name} {route.biker?.last_name}</td>
              <td>
                <button onClick={() => handleEditRoute(route._id)}>Editar</button>
                <button onClick={() => handleDeleteRoute(route._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <section className="AdminDashboard">
      <Navbar />
      <div className="container">
        <h1>Dashboard de Administradores</h1>
        <button onClick={() => setShowCreateRouteModal(true)}>Añadir Ruta</button>
        <button onClick={fetchRoutes}>Actualizar Rutas</button>
        {showCreateRouteModal && <CreateRoutes handleStatus={setShowCreateRouteModal} />}
        <RouteTable />
      </div>
    </section>
  );
};

export default AdminDashboard;
