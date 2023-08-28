const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const routeSchema = new Schema({
  routeID: {
    type: String,
    required: true,
    unique: true,
  },
  province: {
    type: String,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['En curso', 'Pendiente', 'Completada', 'Cancelada'],
    default: 'Pendiente',
  },
  parcels: [
    {
      type: Schema.Types.ObjectId,
      ref: "parcel",
    },
  ],
  biker: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

module.exports = mongoose.model("route", routeSchema);
