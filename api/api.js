import BASE_URL from "./axiosConfig";

// Get all products
export const getProducts = async () => {
  try {
    const response = await BASE_URL.get("/products");
    console.log("Dữ liệu trả về:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error.message);
    if (error.response) {
      console.error("Response error:", error.response.data);
    }
    return [];
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await BASE_URL.get(`/products/${productId}`);
    if (response.data.length === 0) {
      throw new Error("Không tìm thấy sản phẩm với ID đã cho.");
    }
    return response.data;
  } catch (error) {
    console.error(`Lỗi khi lấy sản phẩm với ID ${productId}:`, error);
    throw error;
  }
};
// Get categories
export const getCategories = async () => {
  try {
    const response = await BASE_URL.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh mục:", error);
    return [];
  }
};
// Get reviews for a product
export const getReviewsByProductId = async (productId) => {
  try {
    const response = await BASE_URL.get(`/reviews?product_id=${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};

// Register user
export const registerUser = async (userData) => {
  try {
    const response = await BASE_URL.post("/users", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get information of a user
export const getUserById = async (uid) => {
  try {
    const response = await BASE_URL.get(`/users/${uid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update user information
export const updateUser = async (uid, userData) => {
  try {
    const response = await BASE_URL.put(`/users/${uid}`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get cart by user ID
export const getCartByUserId = async (user_id) => {
  try {
    const cartResponse = await BASE_URL.get(`/cart?user_id=${user_id}`);
    let cartData = cartResponse.data;

    // Lọc các mục có user_id khớp với user_id hiện tại
    cartData = cartData.filter(
      (item) => item.user_id && item.user_id === user_id
    );

    // Gọi API để lấy danh sách sản phẩm
    const productsResponse = await BASE_URL.get("/products");
    const products = productsResponse.data;

    // Bổ sung thông tin price, oldPrice, name, image, discount cho từng item
    const enrichedCartData = cartData.map((cartItem) => {
      const product = products.find(
        (p) => p.product_id === cartItem.product_id
      );
      return {
        ...cartItem,
        name: cartItem.name || product?.name || "Unknown Product",
        image:
          cartItem.image ||
          product?.images?.[0] ||
          "https://via.placeholder.com/120",
        price:
          cartItem.price !== undefined
            ? cartItem.price
            : product?.sale_price || 0,
        oldPrice:
          cartItem.oldPrice !== undefined
            ? cartItem.oldPrice
            : product?.original_price || 0,
        discount:
          cartItem.discount ||
          (product
            ? `${(
                ((product.original_price - product.sale_price) /
                  product.original_price) *
                100
              ).toFixed(0)}%`
            : "0%"),
      };
    });

    return enrichedCartData;
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng:", error);
    return [];
  }
};

// Add to cart API
export const addToCartAPI = async (cartData) => {
  try {
    const response = await BASE_URL.post("/cart", {
      user_id: cartData.user_id,
      product_id: cartData.product_id,
      quantity: cartData.quantity,
      size: cartData.size,
      color: cartData.color,
      price: cartData.price,
      oldPrice: cartData.oldPrice,
      name: cartData.name,
      image: cartData.image,
      discount: cartData.discount,
      added_at: cartData.added_at,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm vào giỏ hàng:", error);
    throw error;
  }
};

// Update cart item API
export const updateCartItemAPI = async (serverId, cartData) => {
  try {
    const response = await BASE_URL.put(`/cart/${serverId}`, {
      user_id: cartData.user_id,
      product_id: cartData.product_id,
      quantity: cartData.quantity,
      size: cartData.size,
      color: cartData.color,
      price: cartData.price,
      oldPrice: cartData.oldPrice,
      name: cartData.name,
      image: cartData.image,
      discount: cartData.discount,
      added_at: cartData.added_at,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật giỏ hàng:", error);
    throw error;
  }
};
