import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { addToCartAPI, getCartByUserId, updateCartItemAPI } from "@/api/api";
import BASE_URL from "@/api/axiosConfig";
import { useAuth } from "@/context/contextAuth";

interface CartItem {
  cart_id: string;
  name: string;
  image: string;
  rating: number;
  price: number;
  oldPrice: number;
  discount: string;
  variations: string[];
  quantity: number;
  size?: string;
  color?: string;
  user_id: string;
  product_id: number;
  serverId?: string;
  added_at: string;
  id?: string; // Có thể bỏ trường này nếu không cần, vì đã có serverId
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "cart_id" | "serverId">) => Promise<void>;
  updateQuantity: (cart_id: string, quantity: number) => Promise<void>;
  removeFromCart: (cart_id: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const generateUniqueCartId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Hàm xóa mục trên máy chủ
const deleteCartItemAPI = async (serverId: string) => {
  try {
    await BASE_URL.delete(`/cart/${serverId}`);
  } catch (error) {
    console.error("Error deleting cart item:", error);
    throw error;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const cartData = await getCartByUserId(user.uid);
          setCartItems(
            cartData.map((item: any) => ({
              ...item,
              cart_id: item.id,
              serverId: item.id,
            }))
          );
        } catch (error) {
          console.error("Error fetching cart data:", error);
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    };
    fetchCart();
  }, [user]);
  const addToCart = async (item: Omit<CartItem, "cart_id" | "serverId">) => {
    const existingItem = cartItems.find(
      (i) =>
        i.product_id === item.product_id &&
        i.size === item.size &&
        i.color === item.color &&
        i.user_id === item.user_id
    );
    const cartItemsCount = cartItems.length;

    if (existingItem) {
      const updatedQuantity = existingItem.quantity + item.quantity;
      setCartItems((prevItems) =>
        prevItems.map((i) =>
          i.cart_id === existingItem.cart_id
            ? { ...i, quantity: updatedQuantity }
            : i
        )
      );

      if (existingItem.serverId) {
        await updateCartItemAPI(existingItem.serverId, {
          ...existingItem,
          quantity: updatedQuantity,
        });
      }
    } else {
      const cart_id = generateUniqueCartId();
      const newItem: CartItem = {
        ...item,
        cart_id,
        serverId: undefined,
        added_at: new Date().toISOString(),
      };

      setCartItems((prevItems) => [...prevItems, newItem]);

      const serverResponse = await addToCartAPI({
        user_id: item.user_id,
        product_id: item.product_id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.price,
        oldPrice: item.oldPrice,
        name: item.name,
        image: item.image,
        discount: item.discount,
        added_at: item.added_at,
      });

      setCartItems((prevItems) =>
        prevItems.map((i) =>
          i.cart_id === newItem.cart_id
            ? { ...i, serverId: serverResponse.id }
            : i
        )
      );
    }
  };

  const updateQuantity = async (cart_id: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cart_id === cart_id
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
    const item = cartItems.find((i) => i.cart_id === cart_id);
    if (item?.serverId) {
      await updateCartItemAPI(item.serverId, {
        ...item,
        quantity: Math.max(1, quantity),
      });
    }
  };

  const removeFromCart = async (cart_id: string) => {
    const item = cartItems.find((i) => i.cart_id === cart_id);
    if (item?.serverId) {
      await deleteCartItemAPI(item.serverId);
    }
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.cart_id !== cart_id)
    );
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQuantity, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
