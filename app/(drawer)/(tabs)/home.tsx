import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { ScrollView } from "react-native-gesture-handler";
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
  const [timerBox, setTimerBox] = useState({
    house: 23,
    minute: 59,
    second: 59,
  });
  const [products, setProducts] = useState<ProductType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const router = useRouter();
  const bannerFlatListRef = useRef<FlatList>(null);

  // Data for the main FlatList
  const [sectionData, setSectionData] = useState<any[]>([]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await getCategories();
        const productsData = await getProducts();
        setCategories(categoriesData);
        setProducts(productsData);
        setFilteredProducts(productsData);
        setLoading(false);
        // Initialize section data
        updateSectionData(productsData, null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Update section data based on selected category
  const updateSectionData = (
    products: ProductType[],
    categoryId: number | null
  ) => {
    if (categoryId !== null) {
      const filtered = products.filter(
        (product) => product.category_id === categoryId
      );
      setSectionData([
        { type: "categories", data: categories },
        { type: "products", data: filtered },
      ]);
    } else {
      setSectionData([
        { type: "categories", data: categories },
        { type: "banner", data: postImages },
        { type: "timer", data: timerBox },
        { type: "products", data: products },
        { type: "banner_component", data: {} },
        { type: "post_lack", data: {} },
        { type: "date_box", data: {} },
        { type: "sponsored", data: {} },
        { type: "hot_banner", data: {} },
      ]);
    }
  };

  // Filter products when category is selected
  useEffect(() => {
    if (selectedCategory === null) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) => product.category_id === selectedCategory
      );
      setFilteredProducts(filtered);
    }
    updateSectionData(products, selectedCategory);
  }, [selectedCategory, products]);

  // Handle category press
  const handleCategoryPress = (categoryId: number) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  // Handle product press
  const handleProductPress = (productId: string) => {
    router.push({
      pathname: "/(screen)/DetailProduct",
      params: { productId: productId.toString() },
    });
  };

  // Timer logic
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

  // Auto-scroll for banner
  useEffect(() => {
    const autoScroll = setInterval(() => {
      if (bannerFlatListRef.current) {
        const nextIndex = (activeIndex + 1) % postImages.length;
        bannerFlatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        setActiveIndex(nextIndex);
      }
    }, 1000);

    return () => clearInterval(autoScroll);
  }, [activeIndex]);

  const handleBannerScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / WIDTH);
    setActiveIndex(index);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Render categories section
  const renderCategories = (categories: CategoryType[]) => (
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
          onPress={() => handleCategoryPress(item.category_id)}
        >
          <Image source={{ uri: item.img_URI }} style={styles.imageStyle} />
          <Text style={styles.textCategory}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  // Render banner section
  const renderBanner = (data: typeof postImages) => (
    <View>
      <FlatList
        ref={bannerFlatListRef}
        data={data}
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
        onScroll={handleBannerScroll}
        contentContainerStyle={{ marginBottom: 10 }}
      />
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        {data.map((_, index) => (
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
    </View>
  );

  // Render products section
  const renderProducts = (products: ProductType[]) => (
    <View>
      {products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text>No products in this category</Text>
        </View>
      ) : (
        <FlatList
          data={products}
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
          scrollEnabled={false} // Disable scrolling since main FlatList handles it
        />
      )}
    </View>
  );

  // Render item for main FlatList
  const renderSection = ({ item }: { item: any }) => {
    switch (item.type) {
      case "categories":
        return renderCategories(item.data);
      case "banner":
        return renderBanner(item.data);
      case "timer":
        return (
          <TimerBox
            house={timerBox.house}
            minute={timerBox.minute}
            second={timerBox.second}
          />
        );
      case "products":
        return renderProducts(item.data);
      case "banner_component":
        return <Banner />;
      case "post_lack":
        return <PostLack />;
      case "date_box":
        return <DateBox />;
      case "sponsored":
        return <Sponsored />;
      case "hot_banner":
        return <Hotbanner />;
      default:
        return null;
    }
  };

  return (
    <FlatList
      data={sectionData}
      renderItem={renderSection}
      keyExtractor={(item, index) => `${item.type}-${index}`}
      contentContainerStyle={styles.container}
    />
  );
};

export default Home;

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
    padding: 5,
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
