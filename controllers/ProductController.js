const createProduct = async (req, res) => {
  res.send("Create product");
};

const getAllProducts = async (req, res) => {
  res.send("All products");
};

const getSingleProduct = async (req, res) => {
  res.send("Single product");
};

const updateProduct = async (req, res) => {
  res.send("Update product");
};

const deleteProduct = (req, res) => {
  res.send("Delete product");
};

const uploadImage = async (req, res) => {
  res.send("Upload Image");
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
