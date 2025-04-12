import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { Rating } from "react-native-ratings";
import Icon from "react-native-vector-icons/FontAwesome";
import { addToWishlistAPI, removeFromWishlistAPI, getWishlistByUserId } from "@/api/api";
import { useAuth } from "@/context/contextAuth";
import { useWishlist } from "@/context/WishlistContext"; // Import useWishlist

const Product = ({ product }: any) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { user } = useAuth();
  const userId = user?.uid;
  const { wishlist, refreshWishlist } = useWishlist(); // Sử dụng WishlistContext

  // Kiểm tra xem sản phẩm có trong danh sách yêu thích không
  useEffect(() => {
    if (!userId) {
      setIsInWishlist(false);
      return;
    }
    const isProductInWishlist = wishlist.some(
      (item) => item.product_id === product.product_id
    );
    setIsInWishlist(isProductInWishlist);
  }, [wishlist, product.product_id, userId]);

  // Hàm để thêm/xóa sản phẩm khỏi danh sách yêu thích
  const toggleWishlist = async () => {
    if (!userId) {
      console.log("User must be logged in to modify wishlist");
      return;
    }
    try {
      if (isInWishlist) {
        // Xóa khỏi wishlist
        const currentWishlist = await getWishlistByUserId(userId);
        const wishlistItem = currentWishlist.find(
          (item: any) => item.product_id === product.product_id
        );
        if (wishlistItem) {
          await removeFromWishlistAPI(wishlistItem.id);
        }
      } else {
        // Thêm vào wishlist
        await addToWishlistAPI({
          user_id: userId,
          product_id: product.product_id,
          added_at: new Date().toISOString(),
        });
      }
      // Làm mới danh sách yêu thích sau khi thay đổi
      await refreshWishlist();
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.images[0] }} style={styles.imageStyle} />
        <TouchableOpacity style={styles.heartIcon} onPress={toggleWishlist}>
          <Icon
            name={isInWishlist ? "heart" : "heart-o"}
            size={20}
            color={isInWishlist ? "red" : "gray"}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{product.name}</Text>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.describe}>
          {product.description}
        </Text>
        <View style={{ flexDirection: "row", gap: 5 }}>
          <Text
            style={[
              styles.price,
              { textDecorationLine: "line-through", color: "#bbbbbb" },
            ]}
          >
            ${product.original_price}
          </Text>
          <Text style={styles.price}>${product.sale_price}</Text>
        </View>
        <View style={styles.starCount}>
          <Rating
            type="star"
            ratingCount={5}
            showRating={false}
            imageSize={10}
            startingValue={product.rating.average}
            readonly
          />
          <Text style={styles.count}>{product.rating.count}</Text>
        </View>
      </View>
    </View>
  );
};

export default Product;

const styles = StyleSheet.create({
  imageStyle: {
    width: "100%",
    height: "auto",
    resizeMode: "cover",
    aspectRatio: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  container: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 3,
    paddingBottom: 10,
  },
  imageContainer: {
    position: "relative",
  },
  heartIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    padding: 5,
  },
  starCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  describe: {
    fontSize: 10,
  },
  price: {
    fontWeight: "500",
    fontSize: 12,
    paddingVertical: 5,
  },
  content: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  count: {
    fontSize: 10,
    color: "#A4A9B3",
  },
});