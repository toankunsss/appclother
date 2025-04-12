import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import Product from "@/component/product";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/contextAuth";
import { useWishlist } from "@/context/WishlistContext"; // Import useWishlist

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

const Wishlist = () => {
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.uid;
  const { wishlist, refreshWishlist } = useWishlist(); // Sử dụng WishlistContext

  const handleProductPress = (productId: string) => {
    router.push({
      pathname: "/(screen)/DetailProduct",
      params: { productId: productId.toString() },
    });
  };

  if (!userId) {
    return (
      <View style={styles.container}>
        <Text>Vui lòng đăng nhập để xem wishlist</Text>
      </View>
    );
  }

  if (wishlist.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Chưa có sản phẩm trong wishlist</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ width: "47%" }}
            onPress={() => {
              handleProductPress(item.product_id);
            }}
          >
            <Product product={item} />
          </TouchableOpacity>
        )}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

export default Wishlist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#F9F9F9",
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
});