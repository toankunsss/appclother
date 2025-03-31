import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/component/formfield";
import { useRouter } from "expo-router"; // Corrected import for router
import CustomButton from "@/component/customButton";
import { useFonts } from "expo-font";

const Signin = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // const [fontsLoaded] = useFonts({
  //   'Roboto-Thin': require('../../assets/font/Roboto/Roboto-Thin.ttf'), // Correct the font family name
  // });

  const router = useRouter();

  // if (!fontsLoaded) {
  //   return <Text>Loading...</Text>; // Show loading until fonts are loaded
  // }

  return (
    <SafeAreaView style={styles.fullcotainer}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>Forgot{"\n"}password?</Text>
          <FormField
            title=""
            Value={form.email}
            placeholder="Enter your email address"
            handldeChangeText={(value: any) =>
              setForm({ ...form, email: value })
            }
            otherStyles={styles.input}
            ketType="email-address"
          />
          <Text style={styles.warningText}>
            <Text style={{ color: "red" }}>*</Text> We will send you a message
            to set or reset your new password
          </Text>
          <CustomButton
            title="Submit"
            handleChangeText={() => router.push("/home")}
            containerStyles={styles.customButton}
            TextStyles={styles.buttonText}
            isLoading={undefined}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signin;

const styles = StyleSheet.create({
  fullcotainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 32,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#A8A8A9",
    backgroundColor: "#F3F3F3",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    width: 317,
    height: 55,
  },
  title: {
    fontWeight: "800",
    fontSize: 36,
    color: "#000000",
    alignSelf: "flex-start",
    marginTop: 30,
  },
  warningText: {
    fontSize: 12,
    alignSelf: "flex-start",
    marginTop: 20,
  },
  customButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F83758",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    width: 317,
    height: 55,
    marginTop: 40,
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
  },
});
