import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "@/component/formfield";
import { useRouter } from "expo-router";
import CustomButton from "@/component/customButton";
import Footer from "@/component/footer";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useEffect } from "react";
import { useAuth } from "@/context/contextAuth";
const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();
  useEffect(() => {
    if (form.email && form.password) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [form.email, form.password]);
  const handleSignIn = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Lỗi", "Vui lòng nhập email và mật khẩu!");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;
      console.log("User:", userCredential.user);
      setUser(user);
      Alert.alert("Thành công", "Đăng nhập thành công!");
      router.push("/home"); // Điều hướng sau khi đăng nhập
    } catch (error: any) {
      console.log("Error:", error.message);
      Alert.alert("Lỗi", "Email hoặc mật khẩu không đúng!");
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.fullContainer}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>Welcome{"\n"}Back!</Text>

          <FormField
            title="Email"
            value={form.email}
            placeholder="Email"
            handldeChangeText={(value: any) =>
              setForm({ ...form, email: value.nativeEvent.text })
            }
            otherStyles={styles.input}
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            placeholder="Password"
            handldeChangeText={(value: any) =>
              setForm({ ...form, password: value.nativeEvent.text })
            }
            otherStyles={styles.input}
            secureTextEntry={true}
          />

          <TouchableOpacity
            style={styles.touchForgot}
            onPress={() => router.push("./forgot")}
          >
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity>

          <CustomButton
            title={loading ? "Logging in..." : "Login"}
            handleChangeText={handleSignIn}
            containerStyles={styles.buttonContainer}
            TextStyles={styles.buttonText}
            isLoading={isDisabled}
          />

          <Footer
            title={<Text>Create An Account</Text>}
            hrefLink={
              <Text
                style={styles.signUpLink}
                onPress={() => router.push("./signup")}
              >
                Sign Up
              </Text>
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
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
  forgot: {
    color: "#F83758",
    fontSize: 12,
  },
  touchForgot: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  buttonContainer: {
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
  signUpLink: {
    color: "red",
    textDecorationLine: "underline",
  },
});
