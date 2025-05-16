
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, FlatList, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";

const RECENT_SEARCHES = ["Sunglasses", "Sweater", "Hoodie"];
const POPULAR_PRODUCTS = [
  {
    id: 1,
    name: "Lihua Tunic White",
    price: 53.0,
    image: "https://images.pexels.com/photos/532220/pexels-photo-532220.jpeg?auto=compress&w=200&h=300",
  },
  {
    id: 2,
    name: "Skirt Dress",
    price: 34.0,
    image: "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&w=200&h=300",
  },
];

const SearchScreen = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [recent, setRecent] = useState(RECENT_SEARCHES);
  const [showFilter, setShowFilter] = useState(false);
  // Filter states
  const [price, setPrice] = useState([10, 80]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [star, setStar] = useState(5);
  const [category, setCategory] = useState("Crop Tops");
  const [discounts, setDiscounts] = useState(["50% off", "40% off", "30% off", "25% off"]);

  const handleRemoveRecent = (item:any) => {
    setRecent(recent.filter((r) => r !== item));
  };
  const handleClearRecent = () => setRecent([]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#222" />
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={20} color="#bbb" style={{ marginLeft: 10 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#bbb"
        />
        <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilter(true)}>
          <Ionicons name="options-outline" size={22} color="#bbb" />
        </TouchableOpacity>
      </View>

      {/* Recent Searches */}
      <View style={styles.recentContainer}>
        <View style={styles.recentHeader}>
          <Text style={styles.recentTitle}>Recent Searches</Text>
          <TouchableOpacity onPress={handleClearRecent}>
            <Ionicons name="trash-outline" size={18} color="#bbb" />
          </TouchableOpacity>
        </View>
        <View style={styles.recentList}>
          {recent.map((item) => (
            <View key={item} style={styles.recentItem}>
              <Text style={styles.recentText}>{item}</Text>
              <TouchableOpacity onPress={() => handleRemoveRecent(item)}>
                <Ionicons name="close" size={16} color="#bbb" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>

      {/* Popular this week */}
      <View style={styles.popularHeader}>
        <Text style={styles.popularTitle}>Popular this week</Text>
        <TouchableOpacity>
          <Text style={styles.showAll}>Show all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={POPULAR_PRODUCTS}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.popularList}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>$ {item.price.toFixed(2)}</Text>
          </View>
        )}
      />
           {/* Filter Modal */}
      {showFilter && (
        <View style={styles.filterOverlay}>
          <View style={styles.filterModal}>
            {/* Header */}
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Filter</Text>
              <TouchableOpacity>
                <Ionicons name="share-social-outline" size={20} color="#888" />
              </TouchableOpacity>
            </View>
            {/* Price */}
            <Text style={styles.filterLabel}>Price</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceText}>$10</Text>
              <View style={styles.priceSlider}>
                {/* Fake slider for UI only */}
                <View style={{height:4,backgroundColor:'#eee',borderRadius:2,flex:1,marginHorizontal:8}}>
                  <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'#222',borderRadius:2,width:'80%'}} />
                  <View style={{position:'absolute',left:'0%',top:-6,width:16,height:16,borderRadius:8,backgroundColor:'#fff',borderWidth:2,borderColor:'#222'}} />
                  <View style={{position:'absolute',left:'70%',top:-6,width:16,height:16,borderRadius:8,backgroundColor:'#fff',borderWidth:2,borderColor:'#222'}} />
                </View>
              </View>
              <Text style={styles.priceText}>$80</Text>
            </View>
            {/* Color */}
            <Text style={styles.filterLabel}>Color</Text>
            <View style={styles.colorRow}>
              {['#F2994A','#EB5757','#333','#6FCF97','#56CCF2','#BB6BD9','#F8BBD0'].map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorCircle, {backgroundColor: color, borderWidth: selectedColor===color?2:0, borderColor: '#222'}]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>
            {/* Star Rating */}
            <Text style={styles.filterLabel}>Star Rating</Text>
            <View style={styles.starRow}>
              {[1,2,3,4,5].map((n) => (
                <TouchableOpacity
                  key={n}
                  style={[styles.starCircle, star===n && styles.starCircleActive]}
                  onPress={() => setStar(n)}
                >
                  <Text style={[styles.starText, star===n && {color:'#fff'}]}>+{n}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Category */}
            <Text style={styles.filterLabel}>Category</Text>
            <View style={styles.categoryBox}>
              <Text style={styles.categoryText}>{category}</Text>
              <Ionicons name="chevron-down" size={16} color="#bbb" style={{marginLeft:6}} />
            </View>
            {/* Discount */}
            <Text style={styles.filterLabel}>Discount</Text>
            <View style={styles.discountRow}>
              {discounts.map((d) => (
                <View key={d} style={styles.discountBox}>
                  <Text style={styles.discountText}>{d}</Text>
                  <Ionicons name="close" size={14} color="#bbb" style={{marginLeft:2}} />
                </View>
              ))}
            </View>
            {/* Buttons */}
            <View style={styles.filterBtnRow}>
              <TouchableOpacity style={styles.resetBtn} onPress={() => {setSelectedColor(null);setStar(5);setCategory('Crop Tops');setDiscounts(["50% off", "40% off", "30% off", "25% off"]);}}>
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyBtn} onPress={() => setShowFilter(false)}>
                <Text style={styles.applyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  backBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    color: '#222',
    backgroundColor: 'transparent',
  },
  filterBtn: {
    paddingHorizontal: 10,
  },
  recentContainer: {
    marginHorizontal: 16,
    marginBottom: 10,
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  recentTitle: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
  },
  recentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f8fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  recentText: {
    fontSize: 14,
    color: '#222',
    marginRight: 4,
  },
  popularHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 8,
  },
  popularTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  showAll: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
  },
  popularList: {
    paddingLeft: 16,
    paddingBottom: 10,
    alignItems: 'flex-start',
    minHeight: 150,
  },
  productCard: {
    width: 140,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 16,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 10,
  },
  productImage: {
    width: 100,
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
    resizeMode: 'cover',
    backgroundColor: '#eee',
  },
  productName: {
    fontSize: 13,
    color: '#222',
    marginBottom: 2,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 13,
    color: '#222',
    fontWeight: '500',
    textAlign: 'center',
  },
  filterOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 9999,
    elevation: 20,
  },
  filterModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 32,
    minHeight: '80%',
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
    alignSelf: 'flex-end',
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
    marginTop: 18,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 13,
    color: '#888',
  },
  priceSlider: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 10,
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 0,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 10,
  },
  starCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#bbb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#fff',
  },
  starCircleActive: {
    backgroundColor: '#222',
    borderColor: '#222',
  },
  starText: {
    fontSize: 15,
    color: '#222',
    fontWeight: '600',
  },
  categoryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f8fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 4,
    width: 140,
  },
  categoryText: {
    fontSize: 14,
    color: '#222',
  },
  discountRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  discountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f8fa',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  discountText: {
    fontSize: 13,
    color: '#222',
    marginRight: 2,
  },
  filterBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  resetBtn: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  resetText: {
    color: '#222',
    fontSize: 15,
    fontWeight: '500',
  },
  applyBtn: {
    backgroundColor: '#222',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 32,
  },
  applyText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
});
