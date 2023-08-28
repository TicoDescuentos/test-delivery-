import { useContext, useEffect, useState } from "react";
import { CreateOffer, Navbar } from "../../components";
import "./Dashboard.scss";
import Cookies from "universal-cookie";
import { allPercels, percelsShipper } from "../../Apis/percel";
import { AppContext } from "../../contextApi/AppContext";

const cookies = new Cookies();

const Dashboard = () => {
  const { AppData, dispatch } = useContext(AppContext);

  useEffect(() => {
    dispatch({ type: "LOADING", payload: true });

    if (cookies.get("user").isShipper) {
      (async () => {
        try {
          const {
            data: { data },
          } = await percelsShipper();
          dispatch({ type: "GET_PERCELS", payload: data });
        } catch (error) {
          console.log(error.response.data.message);
          dispatch({ type: "LOADING", payload: false });
        }
      })();
    } else {
      (async () => {
        try {
          const {
            data: { data },
          } = await allPercels();
          dispatch({ type: "GET_PERCELS", payload: data });
        } catch (error) {
          console.log(error.response.data.message);
          dispatch({ type: "LOADING", payload: false });
        }
      })();
    }
  }, []);

  const ShipperTable = () => {
    return (
      <table className="Dashboard_content_table">
        <thead>
          <tr>
            <th>Num</th>
            <th>Detalles</th>
            <th>Mensajero</th>
            <th>Recoleccion</th>
            <th>Entrega</th>
            <th>Estado</th>
            <th>Método de Pago</th>
            <th>Detalles de Pago</th>
          </tr>
        </thead>
        <tbody>
          {AppData.percels?.map((parcel, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <div className="Dashboard_content_table_request-details">
                  <p>
                    <span>Identificador del pedido: </span>
                    {parcel.name}
                  </p>
                  <p>
                    <span>Direccion de Recoleccion: </span>
                    {parcel.pickup_address}
                  </p>
                  <p>
                    <span>Direccion de entrega: </span>
                    {parcel.dropoff_address}
                  </p>
                </div>
              </td>
              <td>
                {parcel.pickedupBy ? `${parcel.pickedupBy?.first_name} ${parcel.pickedupBy?.last_name}` : "_______________"}
              </td>
              <td>
                {parcel.pickupTime ? new Date(parcel.pickupTime).toDateString() : "_______________"}
              </td>
              <td>
                {parcel.deliveryTime ? new Date(parcel.deliveryTime).toDateString() : "_______________"}
              </td>
              <td className={`Dashboard_content_table_request-status Dashboard_content_table_request-status_${parcel.status}`}>
                <span>{parcel.status}</span>
              </td>
              <td>{parcel.paymentMethod}</td>
              <td>
                {
                  parcel.paymentMethod === 'cash' && parcel.changeNeeded ?
                  `Cambio requerido: ${parcel.totalChange}` :
                  parcel.paymentMethod === 'otro' ? parcel.otherDetails : parcel.amount
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const CarrierTable = () => {
    const [showCreateOffer, setShowCreateOffer] = useState(false);
    const [percelID, setPercelID] = useState(null);

    const HanndelTakeIt = (percelId) => {
      setPercelID(percelId);
      setShowCreateOffer(true);
    };

    return (
      <>
        {showCreateOffer && (
          <CreateOffer PercelID={percelID} Handlestatus={setShowCreateOffer} />
        )}
        <table className="Dashboard_content_table">
          <thead>
            <tr>
            <th>Num</th>
            <th>Detalles</th>
            <th>Mensajero</th>
            <th>Recoleccion</th>
            <th>Entrega</th>
            <th>Estado</th>
            <th>Método de Pago</th>
            <th>Detalles de Pago</th>
            </tr>
          </thead>
          <tbody>
            {AppData.percels?.map((parcel, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <div className="Dashboard_content_table_request-details">
                    <p>
                      <span>Identificador del pedido:: </span>
                      {parcel.name}
                    </p>
                    <p>
                      <span>Direccion de Recoleccion: </span>
                      {parcel.pickup_address}
                    </p>
                    <p>
                      <span>Direccion de entrega: </span>
                      {parcel.dropoff_address}
                    </p>
                  </div>
                </td>
                <td>
                  {parcel.pickupTime ? new Date(parcel.pickupTime).toDateString() : "_______________"}
                </td>
                <td>
                  {parcel.deliveryTime ? new Date(parcel.deliveryTime).toDateString() : "_______________"}
                </td>
                <td className={`Dashboard_content_table_request-status Dashboard_content_table_request-status_${parcel.status}`}>
                  <span>{parcel.status}</span>
                </td>
                <td>
                  <button
                    className="Dashboard_content_table_btn"
                    onClick={() => HanndelTakeIt(parcel._id)}
                  >
                    Offer
                  </button>
                </td>
                <td>{parcel.paymentMethod}</td>
                <td>
                  {
                    parcel.paymentMethod === 'cash' && parcel.changeNeeded ?
                    `Cambio requerido: ${parcel.totalChange}` :
                    parcel.paymentMethod === 'otro' ? parcel.otherDetails : parcel.amount
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };

  return (
    <section className="Dashboard">
      <Navbar />
      <div className="container">
        <div className="Dashboard_content">
          {AppData.percels && AppData.percels.length ? (
            cookies.get("user").isShipper ? <ShipperTable /> : <CarrierTable />
          ) : AppData.isLoading ? (
            <p>Cargando....</p>
          ) : (
            <p className="Dashboard_content_empty">
              Click en crear nueva entrega para comenzar
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
