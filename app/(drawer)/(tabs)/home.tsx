import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { ScrollView, RefreshControl } from "react-native-gesture-handler";
import { getCategories, getProducts } from "@/api/api";
import PostSale from "@/component/postSale";
import TimerBox from "@/component/TimerBox";
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

const Home = () => {
  const WIDTH = Dimensions.get("window").width;
  const HEIGHT = Dimensions.get("window").height;
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [timerBox, setTimerBox] = useState({
    house: 23,
    minute: 59,
    second: 59,
  });
  const [products, setProducts] = useState<ProductType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null); // Danh mục được chọn
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  // Lấy dữ liệu ban đầu
  const fetchData = async () => {
    try {
      const categoriesData = await getCategories();
      const productsData = await getProducts();
      setCategories(categoriesData);
      setProducts(productsData);
      setFilteredProducts(productsData);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Lazy load khi kéo xuống làm mới
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  // Lọc sản phẩm khi danh mục được chọn
  useEffect(() => {
    if (selectedCategory === null) {
      setFilteredProducts(products); // Hiển thị tất cả sản phẩm nếu không có danh mục được chọn
    } else {
      const filtered = products.filter(
        (product) => product.category_id === selectedCategory
      );
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, products]);

  // Xử lý khi nhấn vào danh mục
  const handleCategoryPress = (categoryId: number, categoryName: string) => {
    router.push({
      pathname: "/(screen)/CategoryProducts",
      params: { categoryId, categoryName },
    });
  };

  // Xử lý khi nhấn vào sản phẩm
  const handleProductPress = (productId: string) => {
    router.push({
      pathname: "/(screen)/DetailProduct",
      params: { productId: productId.toString() },
    });
  };

  // Timer cho TimerBox
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

  // Auto-scroll cho banner
  useEffect(() => {
    const autoScroll = setInterval(() => {
      if (flatListRef.current) {
        const nextIndex = (activeIndex + 1) % postImages.length;
        flatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }
    }, 1000);

    return () => clearInterval(autoScroll);
  }, [activeIndex]);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / WIDTH);
    setActiveIndex(index);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.7)' }}>
          <ActivityIndicator size="large" color="#F83758" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#F83758"]}
          tintColor="#F83758"
        />
      }
    >
      {/* Danh mục */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.featuredStyle}
      >
        {categories.map((item) => (
          <TouchableOpacity
            key={item.category_id}
            style={[
              styles.categoriesItem,
              selectedCategory === item.category_id && styles.selectedCategory,
            ]}
            onPress={() => handleCategoryPress(item.category_id, item.name)}
          >
            <Image source={{ uri: item.img_URI }} style={styles.imageStyle} />
            <Text style={styles.textCategory}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Nếu có danh mục được chọn, chỉ hiển thị sản phẩm của danh mục đó */}
      {selectedCategory !== null ? (
        filteredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text>Không có sản phẩm trong danh mục này</Text>
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.product_id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ width: "47%" }}
                onPress={() => handleProductPress(item.product_id.toString())}
              >
                <Product product={item} />
              </TouchableOpacity>
            )}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )
      ) : (
        <ScrollView>
          {/* Banner tự động cuộn */}
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
              <PostSale
                img={item.img}
                sale_off={item.sale_off}
                describe={item.describe}
              />
            )}
            keyExtractor={(item) => item.sale_off}
            onScroll={handleScroll}
            contentContainerStyle={{
              marginBottom: 10,
              paddingHorizontal: 0,
            }}
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

          {/* Timer */}
          <TimerBox
            house={timerBox.house}
            minute={timerBox.minute}
            second={timerBox.second}
          />

          {/* Danh sách sản phẩm ban đầu (hiển thị tất cả) */}
          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => item.product_id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ width: "47%" }}
                onPress={() => handleProductPress(item.id.toString())}
              >
                <Product product={item} />
              </TouchableOpacity>
            )}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={{ paddingBottom: 20 }}
          />

          {/* Các thành phần khác */}
          <Banner />
          <PostLack />
          <DateBox />
          <Sponsored />
          <Hotbanner />
        </ScrollView>
      )}
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
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
    padding: 5
  },
  categoriesItem: {
    alignItems: "center",
    marginRight: 18,
  },
  selectedCategory: {
    backgroundColor: "#FFA3B3",
    borderRadius: 10,
  },
  textCategory: {
    fontSize: 10,
    color: "#21003D",
    marginVertical: 3,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});