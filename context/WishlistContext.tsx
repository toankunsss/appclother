import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getWishlistByUserId } from "@/api/api";
import { useAuth } from "@/context/contextAuth";

type ProductType = {
    product_id: string;
    category_id: number;
    name: string;
    description: string;
    original_price: number;
    sale_price: number;
    stock: number;
    images: string[];
    rating: { average: number; count: number };
    colors: { name: string; code: string }[];
    sizes: string[];
    created_at: string;
    id: string;
};

interface WishlistContextType {
    wishlist: ProductType[];
    setWishlist: (wishlist: ProductType[]) => void;
    refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
    const [wishlist, setWishlist] = useState<ProductType[]>([]);
    const { user } = useAuth();
    const userId = user?.uid;

    // Hàm để làm mới danh sách yêu thích từ API
    const refreshWishlist = async () => {
        if (!userId) {
            setWishlist([]);
            return;
        }
        try {
            const data = await getWishlistByUserId(userId);
            if (Array.isArray(data)) {
                setWishlist(data);
            } else {
                setWishlist([]);
            }
        } catch (error) {
            console.error("Lỗi khi làm mới wishlist:", error);
            setWishlist([]);
        }
    };

    // Tải danh sách yêu thích khi userId thay đổi (khi đăng nhập/đăng xuất)
    useEffect(() => {
        refreshWishlist();
    }, [userId]);

    return (
        <WishlistContext.Provider value={{ wishlist, setWishlist, refreshWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
};