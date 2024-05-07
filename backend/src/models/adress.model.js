const mongoose = require('mongoose');

// Define the Address schema
const AddressSchema = new mongoose.Schema({
  fullName: String,
  streetAddress: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
});

// Ensure uniqueness of the combination of fields
AddressSchema.index(
  {
    fullName: 1,
    streetAddress: 1,
    city: 1,
    state: 1,
    postalCode: 1,
    country: 1,
  },
  { unique: true }
);


// Define and export the Address model
const Address = mongoose.model('Address', AddressSchema);
module.exports = Address;
