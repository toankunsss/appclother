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
  product_id: string;
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

const Wishlist = () => {
  const [products, setProducts] = React.useState<ProductType[]>([]);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        console.log("Data:", data); // Kiểm tra dữ liệu nhận được
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

  const handleProductPress = (productId: string) => {
    router.push({
      pathname: "/(screen)/DetailProduct",
      params: { productId: productId.toString() }, // Chỉ truyền product_id
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
            onPress={() => {
              handleProductPress(item.id);
            }} // Truyền product_id
          >
            <Product product={item} />
          </TouchableOpacity>
        )}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

export default Wishlist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#F9F9F9",
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
});
