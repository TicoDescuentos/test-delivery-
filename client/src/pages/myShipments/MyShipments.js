import React, { useContext, useEffect, useState } from "react";
import { Navbar } from "../../components";
import "./MyShipmetns.scss";
import Cookies from "universal-cookie";
import { AppContext } from "../../contextApi/AppContext";
import { carrierShipments, updateParcel } from "../../Apis/percel";
import PaymentMethodComponent from '../../components/PaymentMethod/paymentMethod';

const cookies = new Cookies();

const MyShipment = () => {
  const { AppData, dispatch } = useContext(AppContext);
  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    dispatch({ type: "LOADING", payload: true });
    (async () => {
      try {
        const {
          data: { data },
        } = await carrierShipments();
        dispatch({ type: "CARRIER_SHIPMENTS", payload: data });
      } catch (error) {
        console.log(error.response.data.message);
        dispatch({ type: "LOADING", payload: false });
      }
    })();
  }, [dispatch]);

  const HandleDeliver = async (percelId) => {
    try {
      // Send the payment method alongside the status
      const {
        data: { data },
      } = await updateParcel(percelId, {
        status: "delivered",
        paymentMethod: paymentMethod
      });
  
      dispatch({ type: "DELIVER_PARCEL", payload: percelId });
    } catch (error) {
      alert(error.response.data.message);
      console.log(error.response.data.message);
    }
  };
  

  const CarrierShipmentTable = () => {
    return (
      <table className="MyShipment_content_table">
        <thead>
          <tr>
            <th>Num</th>
            <th>Request details</th>
            <th>Estimated pick-up</th>
            <th>Estimated drop-off</th>
            <th>Status</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          {AppData.myShipments?.map(
            (
              {
                name,
                dropoff_address,
                pickup_address,
                status,
                pickupTime,
                deliveryTime,
                _id,
              },
              index
            ) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <div className="MyShipment_content_table_request-details">
                    <p>
                      <span>percel name: </span>
                      {name}
                    </p>
                    <p>
                      <span>pickup address: </span>
                      {pickup_address}
                    </p>
                    <p>
                      <span>drop off address: </span>
                      {dropoff_address}
                    </p>
                  </div>
                </td>
                <td>
                  {" "}
                  {pickupTime
                    ? new Date(pickupTime).toDateString()
                    : "_______________"}
                </td>
                <td>
                  {" "}
                  {deliveryTime
                    ? new Date(deliveryTime).toDateString()
                    : "_______________"}
                </td>
                <td
                  className={`MyShipment_content_table_request-status MyShipment_content_table_request-status_${status}`}
                >
                  <span>{status}</span>
                </td>
                <td>
                  {status === "intransit" ? (
                    <PaymentMethodComponent paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
                  ) : null}
                  <button
                    className="btn-secondary"
                    onClick={() => HandleDeliver(_id)}
                    disabled={!paymentMethod || paymentMethod === ""}
                  >
                    Deliver
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    );
  };

  return (
    <section className="MyShipment">
      <Navbar />
      <div className="container">
        <div className="MyShipment_content">
          {AppData.myShipments && AppData.myShipments.length ? (
            !cookies.get("user").isShipper && <CarrierShipmentTable />
          ) : AppData.isLoading ? (
            <p>Loading....</p>
          ) : (
            <p className="MyShipment_content_empty">
              you dont have any offer yet!
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default MyShipment;
