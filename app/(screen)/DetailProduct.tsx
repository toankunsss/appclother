import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from "react-native";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link, useRouter, useLocalSearchParams } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import AddCart from "@/component/addCart";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

// Component CustomRating tự xây dựng
const CustomRating = ({ rating, maxStars = 5, starSize = 15 }) => {
  return (
    <View style={{ flexDirection: "row" }}>
      {[...Array(maxStars)].map((_, index) => {
        // Xác định loại sao: đầy, nửa, hoặc rỗng
        const starType =
          index + 1 <= Math.floor(rating)
            ? "star" // Sao đầy
            : index + 1 <= Math.ceil(rating) && rating % 1 >= 0.5
            ? "star-half" // Sao nửa
            : "star-outline"; // Sao rỗng

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
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [product, setProduct] = useState<any>(null);
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [imgActive, setImgActive] = useState(0);
  const params = useLocalSearchParams();

  // Sử dụng useMemo để ổn định giá trị params.product
  const productParam = useMemo(() => params.product, [params.product]);

  useEffect(() => {
    if (productParam) {
      const productData = JSON.parse(productParam as string);

      // Chỉ cập nhật state nếu dữ liệu thực sự thay đổi
      if (JSON.stringify(productData) !== JSON.stringify(product)) {
        setProduct(productData);

        // Chọn mặc định size và color đầu tiên nếu có
        if (
          productData.sizes &&
          productData.sizes.length > 0 &&
          productData.sizes[0] !== "N/A" &&
          selectedSize !== productData.sizes[0]
        ) {
          setSelectedSize(productData.sizes[0]);
        }
        if (
          productData.colors &&
          productData.colors.length > 0 &&
          selectedColor !== productData.colors[0].code
        ) {
          setSelectedColor(productData.colors[0].code);
        }
      }
    }
  }, [productParam]); // Dependency chỉ là productParam, không phải toàn bộ params

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

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Loading product...</Text>
      </View>
    );
  }

  const images = product.images || [];

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} />
          </TouchableOpacity>
          <Link href="/(drawer)/(tabs)/shop" style={styles.cartIcon}>
            <FontAwesome6 name="cart-shopping" size={14} />
          </Link>
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
      <AddCart
        stock={product.stock}
        product={product}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
      />
    </>
  );
};

export default Viewshop;

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
    lineHeight: 40,
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
});
