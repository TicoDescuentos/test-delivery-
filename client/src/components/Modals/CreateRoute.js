import { useContext, useState, useRef } from "react";
import { addRoute } from "../../Apis/routes"; // Asegúrate de importar la función correcta
import "./Modal.scss";
import Cookies from "universal-cookie";
import { AppContext } from "../../contextApi/AppContext";

const cookies = new Cookies();

const CreateRoute = ({ handleStatus }) => {
  const { dispatch } = useContext(AppContext);
  
  const [formData, setFormData] = useState({});
  const dateInputRef = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Establecer el estado de la ruta a "Creada" automáticamente
      const newFormData = { ...formData, status: "Creada" };
      
      const {
        data: { data },
      } = await addRoute(newFormData);
      dispatch({ type: "ADD_ROUTE", payload: data });
    } catch (error) {
      console.log(error.response.data.message);
      alert(error.response.data.message);
    }
    handleStatus(false);
  };

  const handleDateClick = () => {
    dateInputRef.current.focus();
  };

  return (
    <div className="Modal CreateRoute">
      <div className="Modal_content CreateRoute_content">
        <h1 className="Modal_content_title">Añadir nueva ruta</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="routeID"
            className="inpt Modal_content_inpt"
            placeholder="ID de la Ruta"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="province"
            className="inpt Modal_content_inpt"
            placeholder="Provincia"
            onChange={handleChange}
            required
          />
          <select
            name="timeSlot"
            className="inpt Modal_content_inpt"
            onChange={handleChange}
            required
          >
            <option value="" disabled selected>Intervalo de Tiempo</option>
            <option value="Mañana(8:00AM a medio día)">Mañana(8:00AM a medio día)</option>
            <option value="Tarde(3:00PM a 6:00PM)">Tarde(3:00PM a 6:00PM)</option>
          </select>
          <div className="date-container" onClick={handleDateClick}>
            <input
              ref={dateInputRef}
              type="date"
              name="executionDate"
              className="inpt Modal_content_inpt"
              placeholder="Fecha de Ejecución"
              onChange={handleChange}
              required
            />
          </div>
          <button className="btn-primary">Crear</button>
          <button className="btn-danger" onClick={() => handleStatus(false)}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRoute;
