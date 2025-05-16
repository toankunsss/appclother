import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getProducts } from "@/api/api";
import Product from "@/component/product";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";

type ProductType = {
  product_id: number;
  category_id: number;
  // add other fields as needed
  [key: string]: any;
};

const CategoryProducts = () => {
  const { categoryId, categoryName } = useLocalSearchParams();
  const [products, setProducts] = useState<ProductType[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      const allProducts = await getProducts();
      const filtered = allProducts.filter(
        (item:any) => item.category_id === Number(categoryId)
      );
      setProducts(filtered);
    };
    fetchProducts();
  }, [categoryId]);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
        <TouchableOpacity
            style={{ marginBottom: 16 }}
            onPress={() => router.back()}
        >
        <FontAwesome6 name="chevron-left" size={24} color="#000" />
        </TouchableOpacity>
      <Text style={styles.header}>{categoryName}</Text>
      <Text style={styles.result}>Found {products.length} Results</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.product_id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productCard}
            onPress={() =>
              router.push({
                pathname: "/(screen)/DetailProduct",
                params: { productId: item.product_id.toString() },
              })
            }
          >
            <Product product={item} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  result: { color: "#888", marginBottom: 16 },
  productCard: { width: "48%", marginBottom: 16 },
});

export default CategoryProducts;