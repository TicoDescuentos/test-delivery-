const mongoose = require("mongoose");

const parcelSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  pickup_address: {
    type: String,
    required: true,
  },
  dropoff_address: {
    type: String,
    required: true,
  },
  province: {  // Nuevo campo para almacenar la provincia
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "waiting",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  pickedupBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  pickupTime: {
    type: Date,
  },
  deliveryTime: {
    type: Date,
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'sinpe_transferencia', 'otro', 'pagado'],
    required: true
  },
  amount: {
    type: Number,
    required: function() {
      return ['cash', 'sinpe_transferencia', 'otro'].includes(this.paymentMethod);
    }
  },
  changeNeeded: {
    type: Boolean,
    required: function() {
      return this.paymentMethod === 'cash';
    }
  },
  totalChange: {
    type: Number,
    required: function() {
      return this.paymentMethod === 'cash' && this.changeNeeded;
    }
  },
  otherDetails: {
    type: String,
    required: function() {
      return this.paymentMethod === 'otro';
    }
  }
});

module.exports = mongoose.model("parcel", parcelSchema);
