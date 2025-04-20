import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import AddCart from "@/component/addCart";
import { getProductById } from "@/api/api";
import {
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { useAnimatedStyle } from "react-native-reanimated";
import { useCart } from "@/context/contexCart";
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

const CustomRating = ({ rating, maxStars = 5, starSize = 15 }) => {
  return (
    <View style={{ flexDirection: "row" }}>
      {[...Array(maxStars)].map((_, index) => {
        const starType =
          index + 1 <= Math.floor(rating)
            ? "star"
            : index + 1 <= Math.ceil(rating) && rating % 1 >= 0.5
            ? "star-half"
            : "star-outline";
        return (
          <Ionicons
            key={index}
            name={starType}
            size={starSize}
            color={index + 1 <= Math.ceil(rating) ? "#FFD700" : "#A4A9B3"}
          />
        );
      })}
    </View>
  );
};

const Viewshop = () => {
  const { cartItems } = useCart();
  const totalQuantity = cartItems.length;
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [imgActive, setImgActive] = useState(0);
  const params = useLocalSearchParams();

  const [countCart, setCount] = useState(0);
  const cartIconRef = useRef(null);
  const animatedY = useSharedValue(0);
  const animatedX = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const [showAnimBadge, setShowAnimBadge] = useState(false);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: animatedX.value },
      { translateY: animatedY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const startAnimation = (
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) => {
    animatedX.value = startX;
    animatedY.value = startY;
    scale.value = 1;
    opacity.value = 1;

    animatedX.value = withSpring(endX);
    animatedY.value = withSpring(endY);
    scale.value = withSpring(0.5);
    opacity.value = withTiming(0, { duration: 500 });
  };

  const handleAddToCartSuccess = (event: any) => {
    const { locationX, locationY } = event;
    setShowAnimBadge(true);
    cartIconRef.current?.measure(
      (
        fx: number,
        fy: number,
        width: number,
        height: number,
        px: number,
        py: number
      ) => {
        animatedX.value = locationX;
        animatedY.value = locationY;
        scale.value = 1;
        opacity.value = 1;

        animatedX.value = withSpring(px - 5, { damping: 12 });
        animatedY.value = withSpring(py - 5, { damping: 12 });
        scale.value = withTiming(0.5, { duration: 300 });
        opacity.value = withTiming(0, {
          duration: 300,
          onCallback: () => {
            setShowAnimBadge(false);
          },
        });
      }
    );
    setCount((prev) => prev + 1);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      const productId = params.productId as string;
      console.log("Product ID:", productId);
      if (productId) {
        try {
          const productData = await getProductById(productId);
          console.log("Product data1:", productData);
          setProduct(productData);

          // Chọn mặc định size và color đầu tiên nếu có
          if (
            productData.sizes &&
            productData.sizes.length > 0 &&
            productData.sizes[0] !== "N/A"
          ) {
            setSelectedSize(productData.sizes[0]);
          }
          if (productData.colors && productData.colors.length > 0) {
            setSelectedColor(productData.colors[0].code);
          }
        } catch (error) {
          console.error("Error fetching product:", error);
          setProduct(null);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProduct();
  }, [params.productId]);

  const onchange = (nativeEvent: any) => {
    if (nativeEvent) {
      const slide = Math.round(nativeEvent.contentOffset.x / (WIDTH - 40));
      if (slide !== imgActive) {
        setImgActive(slide);
      }
    }
  };

  const nextImage = () => {
    if (product && imgActive < product.images.length - 1) {
      const nextSlide = imgActive + 1;
      scrollRef.current?.scrollTo({
        x: nextSlide * (WIDTH - 40),
        y: 0,
        animated: true,
      });
      setImgActive(nextSlide);
    }
  };

  const prevImage = () => {
    if (product && imgActive > 0) {
      const prevSlide = imgActive - 1;
      scrollRef.current?.scrollTo({
        x: prevSlide * (WIDTH - 40),
        y: 0,
        animated: true,
      });
      setImgActive(prevSlide);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading product...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Product not found</Text>
      </View>
    );
  }

  const images = product.images || [];

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.navigate("/(drawer)/(tabs)/shop")}
          >
            <View ref={cartIconRef} style={styles.cartIcon}>
              <FontAwesome6 name="cart-shopping" size={20} />
              {totalQuantity > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{totalQuantity}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Image Slider */}
        <View style={styles.imageContainer}>
          <ScrollView
            ref={scrollRef}
            onScroll={({ nativeEvent }) => onchange(nativeEvent)}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            horizontal
            style={styles.wrap}
            contentContainerStyle={styles.wrapContent}
            snapToInterval={WIDTH - 40}
            decelerationRate="fast"
          >
            {images.map((e: string, index: number) => (
              <Image
                key={index}
                resizeMode="contain"
                source={{ uri: e }}
                style={styles.limage}
              />
            ))}
          </ScrollView>
          {images.length > 1 && (
            <>
              <TouchableOpacity onPress={prevImage} style={styles.prevButton}>
                <Ionicons name="chevron-back" size={20} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={nextImage} style={styles.nextButton}>
                <Ionicons name="chevron-forward" size={20} color="black" />
              </TouchableOpacity>
              <View style={styles.wrapDot}>
                {images.map((_: string, index: number) => (
                  <Text
                    key={index}
                    style={imgActive === index ? styles.activeDot : styles.dot}
                  >
                    •
                  </Text>
                ))}
              </View>
            </>
          )}
        </View>

        {/* Product Options */}
        <View style={styles.selectionContainer}>
          {product.sizes &&
            product.sizes.length > 0 &&
            product.sizes[0] !== "N/A" && (
              <>
                <Text style={styles.sectionTitle}>Size</Text>
                <View style={styles.sizeContainer}>
                  {product.sizes.map((size: string) => (
                    <TouchableOpacity
                      style={[
                        styles.sizeButton,
                        selectedSize === size && styles.selectedSizeButton,
                      ]}
                      key={size}
                      onPress={() => setSelectedSize(size)}
                    >
                      <Text
                        style={[
                          styles.sizeText,
                          selectedSize === size && styles.selectedSizeText,
                        ]}
                      >
                        {size}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          {product.colors && product.colors.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Color</Text>
              <View style={styles.colorContainer}>
                {product.colors.map((color: { name: string; code: string }) => (
                  <TouchableOpacity
                    style={[
                      styles.colorButton,
                      { backgroundColor: color.code },
                      selectedColor === color.code &&
                        styles.selectedColorButton,
                    ]}
                    key={color.code}
                    onPress={() => setSelectedColor(color.code)}
                  >
                    {selectedColor === color.code && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                    <View style={styles.tooltip}>
                      <Text style={styles.tooltipText}>{color.name}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </View>

        {/* Product Info */}
        <Text style={styles.productName}>{product.name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.originalPrice}>${product.original_price}</Text>
          <Text style={styles.salePrice}>${product.sale_price}</Text>
          <Text style={styles.discount}>
            {(
              ((product.original_price - product.sale_price) /
                product.original_price) *
              100
            ).toFixed(0)}
            % OFF
          </Text>
        </View>
        <Text style={styles.description}>
          {product.description || "No description available"}
        </Text>

        {/* Rating */}
        <TouchableOpacity
          style={styles.ratingContainer}
          onPress={() =>
            router.push({
              pathname: "/(screen)/review",
              params: { product: JSON.stringify(product) },
            })
          }
        >
          <Text style={styles.ratingTitle}>Reviews</Text>
          <CustomRating rating={product.rating.average} starSize={15} />
          <Text style={styles.ratingCount}>({product.rating.count})</Text>
          <Ionicons name="chevron-forward" size={20} />
        </TouchableOpacity>

        {/* Delivery Info */}
        <View style={styles.deliveryContainer}>
          <Text style={styles.deliveryText}>Delivery in </Text>
          <Text style={styles.deliveryTime}>1-2 Business Days</Text>
        </View>
      </ScrollView>

      {showAnimBadge && (
        <Animated.View style={[styles.animatedBadge, animatedStyle]}>
          <Text style={styles.animatedBadgeText}>+1</Text>
        </Animated.View>
      )}
      {/* Add to Cart Button */}
      <AddCart
        stock={product.stock}
        product={product}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        onAddSuccess={handleAddToCartSuccess}
      />
    </View>
  );
};

export default Viewshop;

// Styles giữ nguyên như cũ
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9F9F9",
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  cartIcon: {
    borderRadius: 20,
    backgroundColor: "#F2F2F2",
    padding: 10,
  },
  badge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: "absolute",
    backgroundColor: "#000",
    top: -5,
    right: -5,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 15,
  },
  wrap: {
    width: WIDTH - 40,
    height: HEIGHT * 0.35,
  },
  wrapContent: {
    alignItems: "center",
  },
  limage: {
    width: WIDTH - 40,
    height: HEIGHT * 0.35,
    borderRadius: 10,
    overflow: "hidden",
  },
  wrapDot: {
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  dot: {
    fontSize: 30,
    lineHeight: 40,
    color: "#888",
  },
  activeDot: {
    fontSize: 40,
    lineHeight: 45,
    color: "#F83758",
  },
  prevButton: {
    position: "absolute",
    backgroundColor: "rgba(187, 187, 187, 0.8)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    left: 10,
    top: "50%",
    transform: [{ translateY: -20 }],
  },
  nextButton: {
    position: "absolute",
    backgroundColor: "rgba(187, 187, 187, 0.8)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    right: 10,
    top: "50%",
    transform: [{ translateY: -20 }],
  },
  selectionContainer: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontWeight: "500",
    fontSize: 16,
    marginBottom: 8,
  },
  sizeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 15,
  },
  sizeButton: {
    minWidth: 50,
    height: 35,
    borderWidth: 1,
    borderColor: "#FA7189",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 8,
  },
  selectedSizeButton: {
    backgroundColor: "#FA7189",
  },
  sizeText: {
    color: "#FA7189",
    fontSize: 14,
    fontWeight: "500",
  },
  selectedSizeText: {
    color: "#fff",
  },
  colorContainer: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  colorButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  selectedColorButton: {
    borderColor: "#000",
  },
  tooltip: {
    position: "absolute",
    top: -30,
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 4,
    borderRadius: 4,
    opacity: 0,
  },
  tooltipText: {
    color: "#fff",
    fontSize: 12,
  },
  productName: {
    fontWeight: "500",
    fontSize: 20,
    marginVertical: 10,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  originalPrice: {
    textDecorationLine: "line-through",
    color: "#bbbbbb",
    fontSize: 16,
  },
  salePrice: {
    fontSize: 18,
    fontWeight: "500",
  },
  discount: {
    color: "red",
    fontSize: 14,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    paddingVertical: 10,
    marginVertical: 10,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  ratingCount: {
    fontSize: 14,
    color: "#A4A9B3",
  },
  deliveryContainer: {
    paddingVertical: 10,
    paddingLeft: 15,
    borderRadius: 5,
    backgroundColor: "#FFCCD5",
    marginBottom: 20,
  },
  deliveryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  deliveryTime: {
    fontSize: 18,
    fontWeight: "bold",
  },
  animatedBadge: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  animatedBadgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
