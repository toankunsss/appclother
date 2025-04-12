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
import React, { useEffect, useState, useRef } from "react";
import { ScrollView } from "react-native-gesture-handler";
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
  id: string;
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
  const flatListRef = useRef<FlatList>(null);

  const handleProductPress = (productId: string) => {
    router.push({
      pathname: "/(screen)/DetailProduct",
      params: { productId: productId.toString() }, // Chỉ truyền product_id
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

  useEffect(() => {
    const autoScroll = setInterval(() => {
      if (flatListRef.current) {
        const nextIndex = (activeIndex + 1) % postImages.length;
        flatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }
    }, 1000); // Scroll mỗi 1 giây

    return () => clearInterval(autoScroll);
  }, [activeIndex]);

  const handldeScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / WIDTH); // Changed from WIDTH - 30 to WIDTH
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
        ref={flatListRef}
        data={postImages}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToAlignment="start"
        decelerationRate="fast"
        snapToInterval={WIDTH}
        renderItem={({ item }) => (
          <View style={{ width: WIDTH }}>
            <PostSale
              img={item.img}
              sale_off={item.sale_off}
              describe={item.describe}
            />
          </View>
        )}
        keyExtractor={(item) => item.sale_off}
        onScroll={handldeScroll}
        contentContainerStyle={{ marginBottom: 10 }}
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
            onPress={() => handleProductPress(item.id)}
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
