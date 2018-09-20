const { mongoose } = require("./mongoose");

const Products = mongoose.model("products", {
  productName: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  productId: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  imgURL: {
    type: String,
    trim: true,
    default:
      "https://images.all-free-download.com/images/graphiclarge/shopping_cart_clip_art_16696.jpg"
  },
});

const Orders = mongoose.model("orders", {
  customerName: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  address: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  productId: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    trim: true
  },
  contact: {
    type: Number,
    required: true,
    trim: true
  },
  delivered: {
    type: Boolean,
    required: true,
    default: false
  }
});

module.exports = {
  Products,
  Orders
};
