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
    const response = await BASE_URL.get(`/products?product_id=${productId}`);

    if (!response.data || response.data.length === 0) {
      throw new Error("Không tìm thấy sản phẩm với ID đã cho.");
    }

    return response.data[0]; // Trả về sản phẩm đầu tiên
  } catch (error) {
    console.log(`Lỗi khi lấy sản phẩm với ID ${productId}:`, error);
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

export const updateCustomerInfo = async (uid, updatedData) => {
  try {
    const currentUserData = await getUserById(uid);
    const userDataToUpdate = {
      ...currentUserData,
      pincode: updatedData.pincode || currentUserData.pincode,
      address: updatedData.address || currentUserData.address,
      city: updatedData.city || currentUserData.city,
      state: updatedData.state || currentUserData.state,
      country: updatedData.country || currentUserData.country,
      bankAccountNumber:
        updatedData.bankAccountNumber || currentUserData.bankAccountNumber,
      accountHolderName:
        updatedData.accountHolderName || currentUserData.accountHolderName,
      ifscCode: updatedData.ifscCode || currentUserData.ifscCode,
      image: updatedData.image || currentUserData.image,
    };
    const response = await updateUser(uid, userDataToUpdate);
    console.log("Cập nhật thông tin thành công:", response);
    return response;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin khách hàng:", error);
    throw error;
  }
};

// Add to wishlist API
export const addToWishlistAPI = async (wishlistData) => {
  try {
    const response = await BASE_URL.post("/wishlist", {
      user_id: wishlistData.user_id,
      product_id: wishlistData.product_id,
      added_at: wishlistData.added_at,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm vào wishlist:", error);
    throw error;
  }
};

// Remove from wishlist API
export const removeFromWishlistAPI = async (wishlistId) => {
  try {
    const response = await BASE_URL.delete(`/wishlist/${wishlistId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa khỏi wishlist:", error);
    throw error;
  }
};

// Get wishlist by user ID
export const getWishlistByUserId = async (user_id) => {
  try {
    const wishlistResponse = await BASE_URL.get(`/wishlist?user_id=${user_id}`);
    let wishlistData = wishlistResponse.data;

    // Filter items by user_id
    wishlistData = wishlistData.filter(
      (item) => item.user_id && item.user_id === user_id
    );

    // Fetch products to enrich wishlist data
    const productsResponse = await BASE_URL.get("/products");
    const products = productsResponse.data;

    // Enrich wishlist data with product details
    const enrichedWishlistData = wishlistData.map((wishlistItem) => {
      const product = products.find(
        (p) => p.product_id === wishlistItem.product_id
      );
      return {
        ...wishlistItem,
        name: product?.name || "Unknown Product",
        images: product?.images || ["https://via.placeholder.com/120"],
        description: product?.description || "",
        original_price: product?.original_price || 0,
        sale_price: product?.sale_price || 0,
        rating: product?.rating || { average: 0, count: 0 },
        colors: product?.colors || [],
        sizes: product?.sizes || [],
        created_at: product?.created_at || "",
      };
    });

    return enrichedWishlistData;
  } catch (error) {
    console.error("Lỗi khi lấy wishlist:", error);
    return [];
  }
};

// api.js
export const getProductsByPriceRange = async (minPrice, maxPrice) => {
  try {
    const response = await BASE_URL.get(
      `/products?sale_price_gte=${minPrice}&sale_price_lte=${maxPrice}`
    );
    console.log("Dữ liệu trả về:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm theo giá:", error.message);
    if (error.response) {
      console.error("Response error:", error.response.data);
    }
    return [];
  }
};

// Update product search function
export const searchProductsByQuery = async (query) => {
  try {
    const response = await BASE_URL.get("/products");
    const searchQuery = query.toLowerCase();

    const filteredProducts = response.data.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery)
    );

    return filteredProducts;
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
};

export const searchProductsWithFilters = async (query, filters) => {
  try {
    const response = await BASE_URL.get("/products");
    let filteredProducts = response.data;

    // Text search
    if (query) {
      const searchQuery = query.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery) ||
          product.description.toLowerCase().includes(searchQuery)
      );
    }

    // Price range filter
    if (filters.priceRange) {
      const { min, max } = filters.priceRange;
      filteredProducts = filteredProducts.filter((product) => {
        const price = parseFloat(product.sale_price);
        return price >= min && price <= max;
      });
    }

    // Category filter
    if (filters.category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category_id.toString() === filters.category
      );
    }

    console.log("Price range:", filters.priceRange);
    console.log("Filtered products:", filteredProducts);
    return filteredProducts;
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
};

// Add order API
export const addOrderAPI = async (orderData) => {
  try {
    const response = await BASE_URL.post("/orders", {
      user_id: orderData.user_id,
      total_amount: orderData.total_amount,
      status: orderData.status || "pending",
      shipping_address: orderData.shipping_address,
      created_at: orderData.created_at || new Date().toISOString(),
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    throw error;
  }
};
export const addOrderItemAPI = async (orderItemData) => {
  try {
    const response = await BASE_URL.post("/order_items", {
      order_id: orderItemData.order_id,
      product_id: orderItemData.product_id,
      quantity: orderItemData.quantity,
      price: orderItemData.price,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm mục đơn hàng:", error);
    throw error;
  }
};

// Get addresses by user ID
export const getAddressesByUserId = async (userId) => {
  try {
    const response = await BASE_URL.get(`/addresses?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return [];
  }
};

// Add new address
export const addAddressAPI = async (addressData) => {
  try {
    const response = await BASE_URL.post("/addresses", {
      userId: addressData.userId,
      name: addressData.name,
      phone: addressData.phone,
      address: addressData.address,
      isDefault: addressData.isDefault || false,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding address:", error);
    throw error;
  }
};

// Update address
export const updateAddressAPI = async (addressId, addressData) => {
  try {
    const response = await BASE_URL.put(`/addresses/${addressId}`, addressData);
    return response.data;
  } catch (error) {
    console.error("Error updating address:", error);
    throw error;
  }
};

// Delete address
export const deleteAddressAPI = async (addressId) => {
  try {
    await BASE_URL.delete(`/addresses/${addressId}`);
    return true;
  } catch (error) {
    console.error("Error deleting address:", error);
    throw error;
  }
};

// Get orders by user ID
export const getOrdersByUserId = async (userId) => {
  try {
    const response = await BASE_URL.get(`/orders?user_id=${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

// Get order items by order ID
export const getOrderItemsByOrderId = async (orderId) => {
  try {
    const response = await BASE_URL.get(`/order_items?order_id=${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order items:", error);
    return [];
  }
};

// Get all orders with their items
export const getOrdersWithItems = async (userId) => {
  try {
    const orders = await getOrdersByUserId(userId);
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await getOrderItemsByOrderId(order.id);
        const enrichedItems = await Promise.all(
          items.map(async (item) => {
            const product = await getProductById(item.product_id);
            return {
              ...item,
              product_name: product?.name || "Unknown Product",
              product_image:
                product?.images?.[0] || "https://via.placeholder.com/100",
            };
          })
        );
        return { ...order, items: enrichedItems };
      })
    );
    return ordersWithItems;
  } catch (error) {
    console.error("Error fetching orders with items:", error);
    return [];
  }
};
