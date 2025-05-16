import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

const images = [
  "https://i.pinimg.com/736x/50/13/78/501378ed578afe5bd3bae8a2c446111b.jpg",
  "https://i.pinimg.com/736x/7f/3a/02/7f3a021324ebc80362ef165d315482cc.jpg",
  "https://i.pinimg.com/736x/50/13/78/501378ed578afe5bd3bae8a2c446111b.jpg",
];

const Sponsored = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollIndex = (index: number) => {
    if (index >= 0 && index < images.length) {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          x: (WIDTH - 20) * index,
          animated: true,
        });
        setCurrentIndex(index);
      } else {
        console.log("scrollRef.current không tồn tại");
      }
    }
  };

  useEffect(() => {
    console.log("scrollRef.current:", scrollRef.current);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sponsored</Text>
      <View style={styles.scrollContainer}>
        <ScrollView
          ref={scrollRef}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          horizontal
          style={styles.scrollView}
        >
          {images.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.image} />
              <View style={styles.overlay}>
                <Text style={styles.discountText}>UP TO</Text>
                <Text style={styles.discountText}>50% OFF</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        {currentIndex > 0 && (
          <TouchableOpacity
            onPress={() => scrollIndex(currentIndex - 1)}
            style={styles.arrowLeft}
          >
            <AntDesign name="left" size={24} color="white" />
          </TouchableOpacity>
        )}
        {currentIndex < images.length - 1 && (
          <TouchableOpacity
            onPress={() => scrollIndex(currentIndex + 1)}
            style={styles.arrowRight}
          >
            <AntDesign name="right" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.footer}>
        <Text style={{ fontWeight: "bold" }}>up to 50% Off</Text>
        <AntDesign name="right" size={16} />
      </View>
    </View>
  );
};

export default Sponsored;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000",
  },
  scrollContainer: {
    position: "relative",
  },
  scrollView: {
    borderRadius: 10,
  },
  imageContainer: {
    width: WIDTH - 20,
    height: HEIGHT / 3,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 10,
  },
  discountText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  arrowLeft: {
    position: "absolute",
    left: 10, // Cố định bên trái
    top: "50%", // Căn giữa theo chiều dọc
    transform: [{ translateY: -20 }], // Điều chỉnh để căn chính xác giữa
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
  },
  arrowRight: {
    position: "absolute",
    right: 10, // Cố định bên phải
    top: "50%", // Căn giữa theo chiều dọc
    transform: [{ translateY: -20 }], // Điều chỉnh để căn chính xác giữa
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
