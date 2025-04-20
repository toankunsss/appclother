import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";
import { ggImag, logo } from "@/contants/image/img";
import React, { useState } from "react";
import Feather from "react-native-vector-icons/Feather";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";
import FontAwesome from "react-native-vector-icons/FontAwesome";
// import * as Speech from "expo-speech";
import { useRouter } from "expo-router";
const Header = ({ onFilterByPrice }) => {
  const navigation = useNavigation();
  const router = useRouter();
  const [text, setText] = useState("");
  // const speak = () => {
  //   if (text.trim() !== "") {
  //     Speech.speak(text);
  //   }
  // };
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showPriceFilter, setShowPriceFilter] = useState(false);

  const applyPriceFilter = () => {
    if (minPrice && maxPrice) {
      onFilterByPrice(parseFloat(minPrice), parseFloat(maxPrice));
      setShowPriceFilter(false);
    }
  };
  return (
    <>
      <View style={styles.contrainer}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Feather name="menu" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.logocontainer}>
          <Image source={logo} style={styles.logo} />
        </View>
        <View style={styles.component}>
          <Link href="/(screen)/profile">
            <Image
              source={ggImag}
              style={{ resizeMode: "contain", height: 40, width: 40 }}
            />
          </Link>
        </View>
      </View>
      <>
        <TouchableOpacity
          style={styles.containerSearch}
          onPress={() => router.push("/(screen)/search")}
        >
          <Feather name="search" size={15} color="#BBBBBB" />
          <View style={styles.textInputDesign}>
            <Text style={{ color: "#BBBBBB" }}>Search any product....</Text>
          </View>
          <TouchableOpacity>
            <Feather name="mic" size={15} color="#BBBBBB" />
          </TouchableOpacity>
        </TouchableOpacity>
      </>
      {/* <View style={styles.containerFeather}>
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>ALL Featured</Text>
        <View style={{ flexDirection: "row", gap: 15 }}>
          <View style={styles.featured}>
            <Text style={styles.textFeatured}>Sort</Text>
            <FontAwesome name="sort" size={14} />
          </View>
          <TouchableOpacity
            style={styles.featured}
            onPress={() => setShowPriceFilter(!showPriceFilter)}
          >
            <Text style={styles.textFeatured}>Filter</Text>
            <FontAwesome name="filter" size={14} />
          </TouchableOpacity>
        </View>
      </View> */}
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  contrainer: {
    justifyContent: "space-between",
    alignItems: "center",
    height: 56,
    flexDirection: "row",
    paddingHorizontal: 16,
    backgroundColor: "#F9F9F9",
  },
  logocontainer: {},
  component: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
  },
  menu: {
    backgroundColor: "#F2F2F2",
  },
  logo: {
    height: 35,
    width: 111,
    resizeMode: "stretch",
  },
  containerSearch: {
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginHorizontal: 17,
    backgroundColor: "#ffffff",
    borderRadius: 6,
    marginBottom: 10,
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
  },
  featured: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: "#fff",
    gap: 5,
  },
  textFeatured: {
    fontSize: 14,
  },
  priceFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 17,
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  priceInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#BBBBBB",
    borderRadius: 6,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  applyButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  applyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
