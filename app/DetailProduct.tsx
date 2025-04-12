// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Animated,
//   ScrollView,
//   Alert,
// } from "react-native";
// import { useRouter, useLocalSearchParams } from "expo-router";
// import AddCart from "@/component/addCart";
// import CartButtonDetail from "@/component/CartButtonDetail";
// import { useProduct } from "@/context/contextProduct";

// export default function DetailProduct() {
//   const router = useRouter();
//   const params = useLocalSearchParams();
//   const { getProductById } = useProduct();
//   const [product, setProduct] = useState<any>(null);
//   const [selectedSize, setSelectedSize] = useState<string | null>(null);
//   const [selectedColor, setSelectedColor] = useState<string | null>(null);
//   const cartButtonRef = useRef<View>(null);
//   const [showAnimation, setShowAnimation] = useState(false);
//   const animationValue = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         if (params.id) {
//           const productData = await getProductById(params.id.toString());
//           setProduct(productData);
//         }
//       } catch (error) {
//         Alert.alert("Error", "Failed to fetch product details");
//       }
//     };
//     fetchProduct();
//   }, [params.id]);

//   const animateAddToCart = () => {
//     setShowAnimation(true);
//     animationValue.setValue(0);
//     Animated.sequence([
//       Animated.timing(animationValue, {
//         toValue: 1,
//         duration: 800,
//         useNativeDriver: true,
//       }),
//     ]).start(() => {
//       setShowAnimation(false);
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <CartButtonDetail targetRef={cartButtonRef} style={styles.cartButton} />
//       </View>

//       {showAnimation && (
//         <Animated.View
//           style={[
//             styles.animationBadge,
//             {
//               transform: [
//                 {
//                   translateY: animationValue.interpolate({
//                     inputRange: [0, 1],
//                     outputRange: [100, -50],
//                   }),
//                 },
//                 {
//                   translateX: animationValue.interpolate({
//                     inputRange: [0, 1],
//                     outputRange: [0, -100],
//                   }),
//                 },
//                 {
//                   scale: animationValue.interpolate({
//                     inputRange: [0, 0.6, 1],
//                     outputRange: [1, 1.2, 0.5],
//                   }),
//                 },
//               ],
//               opacity: animationValue.interpolate({
//                 inputRange: [0, 0.8, 1],
//                 outputRange: [1, 1, 0],
//               }),
//             },
//           ]}
//         >
//           <Text style={styles.animationText}>+1</Text>
//         </Animated.View>
//       )}

//       <ScrollView>{/* Product details can be added here */}</ScrollView>

//       <AddCart
//         stock={product?.stock || 0}
//         product={product}
//         selectedColor={selectedColor}
//         selectedSize={selectedSize}
//         onAddSuccess={animateAddToCart}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     padding: 10,
//     backgroundColor: "#fff",
//     elevation: 2,
//   },
//   cartButton: {
//     position: "absolute",
//     right: 10,
//     top: 10,
//   },
//   animationBadge: {
//     position: "absolute",
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: "black",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 999,
//     right: 50,
//     top: "50%",
//   },
//   animationText: {
//     color: "white",
//     fontSize: 14,
//     fontWeight: "bold",
//   },
// });
