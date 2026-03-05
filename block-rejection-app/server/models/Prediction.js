const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
  // inputs
  temperature:  { type: Number, required: true },
  density:      { type: Number, required: true },
  energy:       { type: Number, required: true },
  pouring_time: { type: Number, required: true },
  flowrate:     { type: Number, required: true },
  tilt_angle:   { type: Number, required: true },
  bin_height:   { type: String, required: true },
  grog_type:    { type: String, required: true },
  quality:      { type: String, required: true },
  unit_wgt:     { type: Number, required: true },
  module:       { type: String, required: true },
  mould_type:   { type: String, required: true },
  sub_location: { type: String, required: true },
  // outputs
  prediction:   { type: Number, required: true },   // 0 or 1
  label:        { type: String, required: true },
  probability:  { type: Number, required: true },
  risk_level:   { type: String, required: true },
  model_used:   { type: String, required: true },
  createdAt:    { type: Date,   default: Date.now },
});

module.exports = mongoose.model('Prediction', PredictionSchema);
