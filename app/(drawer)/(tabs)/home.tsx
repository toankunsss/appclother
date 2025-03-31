import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Dimensions,
} from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { getCategories } from "@/api/api";
import PostSale from "@/component/postSale";
import TimerBox from "@/component/TimerBox";
import { getProducts } from "@/api/api";
import Product from "@/component/product";
import { useRouter } from "expo-router";
import Banner from "@/component/banner";
import DateBox from "@/component/DateBox";
import PostLack from "@/component/postLack";
import Sponsored from "@/component/Sponserd";
import Hotbanner from "@/component/hotbanner";
type CategoryType = {
  category_id: number;
  name: string;
  img_URI: string;
};
const postImages = [
  {
    sale_off: "van toan",
    img: "https://i.pinimg.com/736x/e0/24/92/e024923fbeb237384d84bf90f49c1351.jpg",
    describe: "Mua ngay",
  },
  {
    sale_off: "van toan1",
    img: "https://i.pinimg.com/474x/7d/4f/c8/7d4fc8c82b19d93ae85270f3077b68e7.jpg",
    describe: "Mua ngay",
  },
  {
    sale_off: "van toan2",
    img: "https://i.pinimg.com/474x/72/06/09/72060992fc40f9533ec962c00c56758e.jpg",
    describe: "Mua ngay",
  },
];
type ProductType = {
  product_id: number;
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
};
const home = () => {
  const WIDTH = Dimensions.get("window").width;
  const HEIGHT = Dimensions.get("window").height;
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [timerBox, setTimerBox] = useState({
    house: 23,
    minute: 59,
    second: 59,
  });
  const router = useRouter();
  const [products, setProduct] = useState<ProductType[]>([]);

  const handleProductPress = (product: ProductType) => {
    router.push({
      pathname: "/(screen)/DetailProduct",
      params: { product: JSON.stringify(product) },
    });
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerBox((prevState) => {
        let { house, minute, second } = prevState;
        if (second > 0) {
          second--;
        } else if (minute > 0) {
          minute--;
          second = 59;
        } else if (house > 0) {
          house--;
          minute = 59;
          second = 59;
        } else {
          clearInterval(interval);
        }
        return { house, minute, second };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesData = await getCategories();
      const items = await getProducts();
      setProduct(items);
      setCategories(categoriesData);
      setLoading(false);
    };
    fetchCategories();
  }, []);

  const handldeScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x; // Vị trí cuộn theo chiều ngang
    const index = Math.round(contentOffsetX / (WIDTH - 30)); // Tính chỉ số phần tử hiện tại
    console.log("Current index:", index); // In chỉ số phần tử hiện tại
    setActiveIndex(index);
  };
  return (
    <ScrollView style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.featuredStyle}
      >
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          categories.map((item) => (
            <View key={item.category_id} style={styles.categoriesItem}>
              <Image source={{ uri: item.img_URI }} style={styles.imageStyle} />
              <Text style={styles.textCategory}>{item.name}</Text>
            </View>
          ))
        )}
      </ScrollView>
      <FlatList
        data={postImages}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        renderItem={({ item }) => (
          <PostSale
            img={item.img}
            sale_off={item.sale_off}
            describe={item.describe}
          />
        )}
        keyExtractor={(item) => item.sale_off}
        contentContainerStyle={{ paddingHorizontal: 0, marginBottom: 10 }}
        onScroll={handldeScroll} // Gọi hàm khi cuộn
        snapToAlignment="center" // Căn giữa phần tử
        decelerationRate="fast"
        snapToInterval={WIDTH - 30} // Chiều rộng của mỗi phần tử
      />
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        {postImages.map((_, index) => (
          <View
            key={index}
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: activeIndex === index ? "#FFA3B3" : "#DEDBDB",
              marginHorizontal: 5,
            }}
          />
        ))}
      </View>
      <TimerBox
        house={timerBox.house}
        minute={timerBox.minute}
        second={timerBox.second}
      />
      <FlatList
        data={products}
        showsHorizontalScrollIndicator
        horizontal
        pagingEnabled
        keyExtractor={(item) => item.product_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ width: WIDTH / 2 - 20, borderRadius: 20 }}
            onPress={() => handleProductPress(item)}
          >
            <Product product={item} />
          </TouchableOpacity>
        )}
        contentContainerStyle={{ gap: 10 }}
      />
      <Banner />
      <PostLack />
      <DateBox />
      <Sponsored />
      <Hotbanner />
    </ScrollView>
  );
};

export default home;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  imageStyle: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  featuredStyle: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
  },
  categoriesItem: {
    alignItems: "center",
    marginTop: 10,
    marginRight: 18,
  },
  textCategory: {
    fontSize: 10,
    color: "#21003D",
    marginVertical: 3,
  },
});
