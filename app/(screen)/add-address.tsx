import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";

const AddAddress = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchAddressSuggestions = async (text: string) => {
    setQuery(text);
    setAddress(text); // update visible input
    if (text.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          text
        )}&format=json&addressdetails=1&limit=5`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Address fetch error:", err);
    }
  };

  const handleSave = () => {
    if (!name || !phone || !address) {
      Alert.alert("Please fill in all fields.");
      return;
    }

    // Normally you'd send data to your API or state here.
    Alert.alert("Address saved!", `${name}, ${phone}, ${address}`);
    router.back(); // Go back to address list
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Address</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.form}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter your phone"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={fetchAddressSuggestions}
          placeholder="Search your address"
        />

        {suggestions.length > 0 && (
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.place_id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => {
                  setAddress(item.display_name);
                  setSuggestions([]);
                }}
              >
                <Text>{item.display_name}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Address</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default AddAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#f5f5f5",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "500",
    marginLeft: 20,
  },
  form: {
    padding: 20,
  },
  label: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 8,
    backgroundColor: "#fafafa",
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#f9f9f9",
  },
  saveButton: {
    backgroundColor: "#007aff",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});
