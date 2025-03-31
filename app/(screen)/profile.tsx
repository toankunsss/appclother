import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomButton from "@/component/customButton";
import FormField from "@/component/formfield";
import { auth } from "../../firebase/firebaseConfig";
import { getUserById, updateUser } from "@/api/api";

const Profile = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({
    email: "",
    pincode: "",
    address: "",
    city: "",
    state: "",
    country: "",
    bankAccountNumber: "",
    accountHolderName: "",
    ifscCode: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const data = await getUserById(user.uid);
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await updateUser(user.uid, userData);
        console.log("User data updated");
        router.push("/home");
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ position: "absolute", left: -10 }}
        >
          <Ionicons name="chevron-back" size={28} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.tittle}>Personal Details</Text>
        <FormField
          title="Email" // Thêm title
          value={userData.email}
          placeholder="Your Email"
          handldeChangeText={(value: any) =>
            setUserData({ ...userData, email: value.nativeEvent.text })
          }
          otherStyles={styles.textInputStyle}
          keyboardType="email-address"
        />
        <FormField
          title="Pincode" // Thêm title
          value={userData.pincode}
          placeholder="Pincode"
          handldeChangeText={(value: any) =>
            setUserData({ ...userData, pincode: value.nativeEvent.text })
          }
          otherStyles={styles.textInputStyle}
        />
        <FormField
          title="Address" // Thêm title
          value={userData.address}
          placeholder="Address"
          handldeChangeText={(value: any) =>
            setUserData({ ...userData, address: value.nativeEvent.text })
          }
          otherStyles={styles.textInputStyle}
        />
        <FormField
          title="City" // Thêm title
          value={userData.city}
          placeholder="City"
          handldeChangeText={(value: any) =>
            setUserData({ ...userData, city: value.nativeEvent.text })
          }
          otherStyles={styles.textInputStyle}
        />
        <FormField
          title="State" // Thêm title
          value={userData.state}
          placeholder="State"
          handldeChangeText={(value: any) =>
            setUserData({ ...userData, state: value.nativeEvent.text })
          }
          otherStyles={styles.textInputStyle}
        />
        <FormField
          title="Country" // Thêm title
          value={userData.country}
          placeholder="Country"
          handldeChangeText={(value: any) =>
            setUserData({ ...userData, country: value.nativeEvent.text })
          }
          otherStyles={styles.textInputStyle}
        />
        <FormField
          title="Bank Account Number" // Thêm title
          value={userData.bankAccountNumber}
          placeholder="Bank Account Number"
          handldeChangeText={(value: any) =>
            setUserData({
              ...userData,
              bankAccountNumber: value.nativeEvent.text,
            })
          }
          otherStyles={styles.textInputStyle}
        />
        <FormField
          title="Account Holder Name" // Thêm title
          value={userData.accountHolderName}
          placeholder="Account Holder Name"
          handldeChangeText={(value: any) =>
            setUserData({
              ...userData,
              accountHolderName: value.nativeEvent.text,
            })
          }
          otherStyles={styles.textInputStyle}
        />
        <FormField
          title="IFSC Code" // Thêm title
          value={userData.ifscCode}
          placeholder="IFSC Code"
          handldeChangeText={(value: any) =>
            setUserData({ ...userData, ifscCode: value.nativeEvent.text })
          }
          otherStyles={styles.textInputStyle}
        />

        <CustomButton
          title="Save"
          handleChangeText={handleSave}
          containerStyles={styles.button}
          TextStyles={styles.textbutton}
          isLoading={false}
        />
      </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    padding: 35,
    flex: 1,
    backgroundColor: "#fff",
  },
  button: {
    height: 52,
    borderRadius: 8,
    backgroundColor: "#F83758",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 35,
  },
  textbutton: {
    color: "#fff",
    fontSize: 15,
  },
  textInputStyle: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#C8C8C8",
    paddingHorizontal: 20,
    marginBottom: 10,
    height: 40,
  },
  tittle: {
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 10,
  },
  textInput: {
    marginTop: 18,
    marginBottom: 11,
  },
});
