const parcel = require("../models/parcel");

// create new parcel
// create new parcel
const createParcel = async (req, res, next) => {
  try {
    const {
      name,
      pickup_address,
      dropoff_address,
      paymentMethod,
      amount,
      changeNeeded,
      otherDetails,
      totalChange,
      province // Nuevo campo
    } = req.body;

    // Creación del nuevo paquete con los campos
    let newParcel = new parcel({
      name,
      pickup_address,
      dropoff_address,
      paymentMethod,
      amount,
      changeNeeded,
      otherDetails,
      totalChange,
      province, // Añadimos provincia aquí
      createdBy: req.user._id
    });
    

    newParcel = await newParcel.save();
    if (!newParcel)
      throw new Error("something went wrong, please try again or connect to customer services ");

    return res
      .status(200)
      .json({ message: "create successfully", success: true, data: newParcel });
  } catch (error) {
    return next(error);
  }
};

// update percel by biker
const updatePercel = async (req, res, next) => {
  try {
      const allStatus = ["waiting", "intransit", "delivered"];
      const validPaymentMethods = ["efectivo", "sinpe_transferencia", "tarjeta"]; // Añadir métodos según necesidad

      const { status, paymentMethod } = req.body; 
      const userId = req.user._id;

      // Simple validation for status
      if (!allStatus.includes(status)) {
          return res
              .status(400) 
              .json({ message: "Invalid status", success: false });
      }

      if (status === "delivered") { 
          // Validation for payment method when delivered
          if (!validPaymentMethods.includes(paymentMethod)) {
              return res
                  .status(400)
                  .json({ message: "Invalid payment method", success: false });
          }
      }

      if (status == "intransit") {
          const updatedPercel = await parcel.findOneAndUpdate(
              { _id: req.params.id, status: "waiting" },
              { ...req.body, pickedupBy: userId },
              { new: true }
          );

          if (!updatedPercel)
              return res.status(400).json({
                  message: "Unfortunately this shipment was taken by another biker!",
                  success: false,
              });
          return res.status(200).json({
              message: "Parcel updated successfully",
              success: true,
              data: updatedPercel,
          });
      }

      const updatedPercel = await parcel.findByIdAndUpdate(
          req.params.id,
          { status, paymentMethod }, // Añadido paymentMethod
          { new: true }
      );

      return res.status(200).json({
          message: "Updated successfully",
          data: updatedPercel,
          success: true,
      });

  } catch (error) {
      return next(error);
  }
};


// get percels`s of shipper
const percelShipper = async (req, res, next) => {
  try {
    const allPercels = await parcel
      .find({ createdBy: req.user._id })
      .populate("pickedupBy");
    if (!allPercels)
      return res.status(500).json({
        message:
          "somethign went wrong please try again or contact to customer sevices ",
      });
    return res.status(200).json({ data: allPercels, success: true });
  } catch (error) {
    return next(error);
  }
};

// get all percels
const allParcels = async (req, res, next) => {
  try {
    const { province } = req.query; // Añadir esto para aceptar un parámetro de provincia en la consulta
    let filter = { status: "waiting" };

    // Filtrar por provincia si se proporciona
    if (province) {
      filter.province = province;
    }

    const getPercels = await parcel.find(filter);
    return res.status(200).json({ data: getPercels, success: true });
  } catch (error) {
    return next(error);
  }
};


//get all carrier shipments
const CarrierShipmetns = async (req, res, next) => {
  try {
    const getPercels = await parcel.find({ pickedupBy: req.user._id });
    if (!getPercels)
      return res.status(500).json({
        message:
          "somethign went wrong please try again or contact to customer sevices ",
      });
    return res.status(200).json({ data: getPercels, success: true });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createParcel,
  updatePercel,
  percelShipper,
  allParcels,
  CarrierShipmetns,
};
