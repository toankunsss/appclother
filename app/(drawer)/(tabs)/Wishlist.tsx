import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Product from "@/component/product";
import { getProducts } from "@/api/api";
import { useRouter } from "expo-router";

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

const Wishlist = () => {
  const [products, setProducts] = React.useState<ProductType[]>([]);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleProductPress = (product: ProductType) => {
    router.push({
      pathname: "/(screen)/DetailProduct",
      params: { product: JSON.stringify(product) },
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Chưa có sản phẩm trong wishlist</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.product_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ width: "47%" }}
            onPress={() => handleProductPress(item)}
          >
            <Product product={item} />
          </TouchableOpacity>
        )}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper} // Căn chỉnh khoảng cách
      />
    </View>
  );
};

export default Wishlist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10, // Giảm padding để vừa với 2 cột
    backgroundColor: "#F9F9F9",
  },
  columnWrapper: {
    justifyContent: "space-between", // Đảm bảo khoảng cách đều giữa 2 cột
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 20, // Thêm padding dưới cùng để không bị che
  },
});
