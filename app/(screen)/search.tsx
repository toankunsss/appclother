import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, memo, useCallback } from "react";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { searchProductsWithFilters, getCategories } from "@/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";
import Toast from "react-native-toast-message";

interface Product {
  product_id: number;
  category_id: number;
  name: string;
  description: string;
  original_price: number;
  sale_price: number;
  stock: number;
  images: string[];
  rating: {
    average: number;
    count: number;
  };
  colors: Array<{
    name: string;
    code: string;
  }>;
  sizes: string[];
  created_at: string;
  id: string;
}

const FilterModal = memo(
  ({ visible, onClose, onApply, initialFilters, categories }) => {
    const [localFilters, setLocalFilters] = useState(initialFilters);

    useEffect(() => {
      setLocalFilters(initialFilters);
    }, [initialFilters]);

    const handleFilterChange = useCallback((type, value) => {
      setLocalFilters((prev) => {
        if (type === "price") {
          const newPriceRange = { ...prev.priceRange, ...value };
          // Ensure min is not greater than max
          if (
            type === "price" &&
            value.min &&
            value.min > prev.priceRange.max
          ) {
            newPriceRange.max = value.min;
          }
          if (
            type === "price" &&
            value.max &&
            value.max < prev.priceRange.min
          ) {
            newPriceRange.min = value.max;
          }
          return {
            ...prev,
            priceRange: newPriceRange,
          };
        }
        return { ...prev, [type]: value };
      });
    }, []);

    const handleApply = () => {
      const validatedFilters = {
        ...localFilters,
        priceRange: {
          min: Number(localFilters.priceRange.min) || 0,
          max: Number(localFilters.priceRange.max) || 1000,
        },
      };

      console.log("=== Filter Application ===");
      console.log("Applied Filters:", {
        priceRange: `$${validatedFilters.priceRange.min} - $${validatedFilters.priceRange.max}`,
        category: validatedFilters.category || "All",
        size: validatedFilters.size || "All",
      });

      onApply(validatedFilters);
    };

    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay} pointerEvents="auto">
          <View style={[styles.filterContainer, { elevation: 5 }]}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Filter Products</Text>
              <TouchableOpacity onPress={onClose}>
                <Feather name="x" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {/* Price Range Slider */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Price Range</Text>
                <View style={styles.priceRangeContainer}>
                  <Text>Min: ${localFilters.priceRange.min}</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={1000}
                    step={10}
                    value={localFilters.priceRange.min}
                    onValueChange={(value) =>
                      handleFilterChange("price", { min: value })
                    }
                    minimumTrackTintColor="#000"
                    maximumTrackTintColor="#ddd"
                    thumbTintColor="#000"
                  />
                  <Text>Max: ${localFilters.priceRange.max}</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={1000}
                    step={10}
                    value={localFilters.priceRange.max}
                    onValueChange={(value) =>
                      handleFilterChange("price", { max: value })
                    }
                    minimumTrackTintColor="#000"
                    maximumTrackTintColor="#ddd"
                    thumbTintColor="#000"
                  />
                </View>
              </View>

              {/* Category */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Category</Text>
                <View style={styles.categoryButtons}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryButton,
                        localFilters.category === cat.name &&
                          styles.categoryButtonActive,
                      ]}
                      onPress={() => handleFilterChange("category", cat.name)}
                    >
                      <Text
                        style={
                          localFilters.category === cat.name
                            ? styles.categoryTextActive
                            : styles.categoryText
                        }
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Size */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Size</Text>
                <View style={styles.sizeButtons}>
                  {["S", "M", "L", "XL", "XXL"].map((size) => (
                    <TouchableOpacity
                      key={size}
                      style={[
                        styles.sizeButton,
                        localFilters.size === size && styles.sizeButtonActive,
                      ]}
                      onPress={() => handleFilterChange("size", size)}
                    >
                      <Text
                        style={
                          localFilters.size === size
                            ? styles.sizeTextActive
                            : styles.sizeText
                        }
                      >
                        {size}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Apply Button */}
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApply}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.visible === nextProps.visible &&
      JSON.stringify(prevProps.initialFilters) ===
        JSON.stringify(nextProps.initialFilters)
    );
  }
);

const renderProduct = ({ item }: { item: Product }) => (
  <View style={{ width: "47%" }}>
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Image source={{ uri: item.images[0] }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.salePrice}>${item.sale_price}</Text>
          {item.original_price > item.sale_price && (
            <Text style={styles.originalPrice}>${item.original_price}</Text>
          )}
        </View>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.rating}>{item.rating.average}</Text>
          <Text style={styles.ratingCount}>({item.rating.count})</Text>
        </View>
      </View>
    </TouchableOpacity>
  </View>
);

export default function SearchScreen() {
  const [text, setText] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 1000 },
    category: "",
    size: "",
  });
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  const showToast = (message: any) => {
    Toast.show({
      type: "info",
      text1: message,
      position: "bottom",
      visibilityTime: 2000,
    });
  };

  // Load recent searches
  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const searches = await AsyncStorage.getItem("recentSearches");
      if (searches) {
        setRecentSearches(JSON.parse(searches));
      }
    } catch (error) {
      console.error("Error loading recent searches:", error);
    }
  };

  const saveSearch = async (searchText: any) => {
    if (!searchText.trim()) return;
    try {
      const updatedSearches = [
        searchText,
        ...recentSearches.filter((s) => s !== searchText),
      ].slice(0, 5);
      setRecentSearches(updatedSearches);
      await AsyncStorage.setItem(
        "recentSearches",
        JSON.stringify(updatedSearches)
      );
    } catch (error) {
      console.error("Error saving search:", error);
    }
  };

  const removeRecentSearch = async (searchToRemove: string) => {
    try {
      const updatedSearches = recentSearches.filter(
        (search) => search !== searchToRemove
      );
      setRecentSearches(updatedSearches);
      await AsyncStorage.setItem(
        "recentSearches",
        JSON.stringify(updatedSearches)
      );
    } catch (error) {
      console.error("Error removing recent search:", error);
    }
  };

  const handleSearch = async (searchText: any) => {
    setText(searchText);
    await saveSearch(searchText);
  };

  useEffect(() => {
    const loadCategories = async () => {
      const cats = await getCategories();
      setCategories(cats);
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!filters || !filters.priceRange) return;

      setLoading(true);
      try {
        const data = await searchProductsWithFilters(text, filters);
        console.log("Search Results:", {
          query: text,
          priceRange: `$${filters.priceRange.min} - $${filters.priceRange.max}`,
          resultsCount: data.length,
          results: data.map((item) => ({
            name: item.name,
            price: item.sale_price,
            category: item.category_id,
          })),
        });

        setProducts(data);
      } catch (error) {
        console.error("Search error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [text, filters]);

  const handleApplyFilters = useCallback(
    (newFilters: any) => {
      const validatedFilters = {
        ...newFilters,
        priceRange: {
          min: Number(newFilters.priceRange?.min) || 0,
          max: Number(newFilters.priceRange?.max) || 1000,
        },
      };

      console.log("Search Filters:", {
        text: text || "No search text",
        priceRange: `$${validatedFilters.priceRange.min} - $${validatedFilters.priceRange.max}`,
        category: validatedFilters.category || "All categories",
      });

      setFilters(validatedFilters);
      setShowFilterModal(false);
    },
    [text]
  );

  const handleCloseModal = useCallback(() => {
    setShowFilterModal(false);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.containerFeather}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="chevron-left" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Search</Text>
        <TouchableOpacity>
          <FontAwesome name="heart-o" size={20} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={styles.containerSearch}>
          <Feather name="search" size={15} color="#BBBBBB" />
          <TextInput
            placeholder="Search any Product..."
            placeholderTextColor="#BBBBBB"
            style={styles.textInputDesign}
            value={text}
            onChangeText={handleSearch}
          />
          <TouchableOpacity>
            <Feather name="mic" size={15} color="#BBBBBB" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => setShowFilterModal(true)}
        >
          <Feather name="filter" size={25} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Recent Searches */}
      {text.trim() === "" && recentSearches.length > 0 && (
        <View style={styles.recentSearches}>
          <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
          {recentSearches.map((search, index) => (
            <View key={index} style={styles.recentSearchItem}>
              <TouchableOpacity
                style={styles.recentSearchContent}
                onPress={() => handleSearch(search)}
              >
                <Feather name="clock" size={16} color="#666" />
                <Text style={styles.recentSearchText}>{search}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => removeRecentSearch(search)}
                style={styles.deleteButton}
              >
                <Feather name="x" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={styles.loader} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.productList}
          ListEmptyComponent={
            text.trim() !== "" && (
              <Text style={styles.noResults}>No products found</Text>
            )
          }
        />
      )}

      <FilterModal
        visible={showFilterModal}
        onClose={handleCloseModal}
        onApply={handleApplyFilters}
        initialFilters={filters}
        categories={categories}
      />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerSearch: {
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    backgroundColor: "#ffffff",
    borderRadius: 6,
    marginLeft: 15,
    flex: 9,
  },
  containerFeather: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 17,
    marginVertical: 10,
  },
  textInputDesign: {
    flex: 1,
    fontSize: 14,
    marginLeft: 10,
  },
  productList: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  noResults: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  loading: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  filterContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  priceInputs: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 8,
    width: 100,
  },
  priceRangeContainer: {
    paddingHorizontal: 10,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  categoryButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  categoryButtonActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  categoryText: {
    color: "#000",
  },
  categoryTextActive: {
    color: "#fff",
  },
  sizeButtons: {
    flexDirection: "row",
    gap: 10,
  },
  sizeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  sizeButtonActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  sizeText: {
    color: "#000",
  },
  sizeTextActive: {
    color: "#fff",
  },
  applyButton: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  recentSearches: {
    padding: 15,
  },
  recentSearchesTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  recentSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  recentSearchContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 10,
  },
  recentSearchText: {
    fontSize: 14,
    color: "#666",
  },
  deleteButton: {
    padding: 5,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  productInfo: {
    padding: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  salePrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: "#666",
    textDecorationLine: "line-through",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 12,
    marginLeft: 4,
    marginRight: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: "#666",
  },
  productRow: {
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
