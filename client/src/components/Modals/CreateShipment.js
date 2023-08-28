import { useContext, useState } from "react";
import { createPercel } from "../../Apis/percel";
import "./Modal.scss";
import Cookies from "universal-cookie";
import { AppContext } from "../../contextApi/AppContext";

const cookies = new Cookies();

const CreateShipment = ({ Handlestatus }) => {
  const { dispatch } = useContext(AppContext);
  
  const [formData, setFormData] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('');

  // Handle form change
  const HandleChange = (e) => {
    if(e.target.name === 'paymentMethod') {
      setPaymentMethod(e.target.value);
    }
    
    let value = e.target.value;
    if (e.target.name === "changeNeeded") {
      value = e.target.checked;
    }

    setFormData({ ...formData, [e.target.name]: value });
  };

  // Handle submit form
  const HandleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {
        data: { data },
      } = await createPercel(formData);
      dispatch({ type: "CREATE_SHIPMENT", payload: data });
    } catch (error) {
      console.log(error.response.data.message);
      alert(error.response.data.message);
    }
    Handlestatus(false);
  };

  return (
    <div className="Modal CreateShipment">
      <div className="Modal_content CreateShipment_content">
        <h1 className="Modal_content_title">Create your new shipment</h1>
        <form onSubmit={HandleSubmit}>
          <input
            type="text"
            name="name"
            className="inpt Modal_content_inpt"
            placeholder="your shipment name"
            onChange={HandleChange}
            required
          />
          <input
            type="text"
            name="pickup_address"
            className="inpt Modal_content_inpt"
            placeholder="your pickup address"
            onChange={HandleChange}
            required
          />
          <input
            type="text"
            name="dropoff_address"
            className="inpt Modal_content_inpt"
            placeholder="your drop off address"
            onChange={HandleChange}
            required
          />
          <select
            name="province"
            className="inpt Modal_content_inpt"
            onChange={HandleChange}
            required
          >
            <option value="">Selecciona la provincia de entrega</option>
            <option value="Heredia">Heredia</option>
            <option value="San Jose">San José</option>
            <option value="Cartago">Cartago</option>
            <option value="Alajuela">Alajuela</option>
          </select>
          <select name="paymentMethod" className="inpt Modal_content_inpt" onChange={HandleChange} required>
            <option value="">Selecciona método de pago</option>
            <option value="cash">Efectivo</option>
            <option value="sinpe_transferencia">Transferencia SINPE</option>
            <option value="otro">Otro</option>
            <option value="pagado">Pagado</option>
          </select>
          {['cash', 'sinpe_transferencia', 'otro'].includes(paymentMethod) && (
            <input
              type="number"
              name="amount"
              className="inpt Modal_content_inpt"
              placeholder="Monto a cobrar"
              onChange={HandleChange}
              required
            />
          )}
          {paymentMethod === 'cash' && (
            <div>
              <label>¿El mensajero necesita llevar cambio?
                <input
                  type="checkbox"
                  name="changeNeeded"
                  className="inpt Modal_content_inpt"
                  onChange={e => HandleChange({ ...e, value: e.target.checked })}
                />
              </label>
              {formData.changeNeeded && (
                <input
                  type="number"
                  name="totalChange"
                  className="inpt Modal_content_inpt"
                  placeholder="Vuelto total a llevar"
                  onChange={HandleChange}
                  required
                />
              )}
            </div>
          )}
          {paymentMethod === 'otro' && (
            <input
              type="text"
              name="otherDetails"
              className="inpt Modal_content_inpt"
              placeholder="Detalles adicionales"
              onChange={HandleChange}
              required
            />
          )}
          <button className="btn-primary">Create</button>
          <button className="btn-danger" onClick={() => Handlestatus(false)}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateShipment;
