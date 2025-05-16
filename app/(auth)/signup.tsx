import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  AlertButton,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import FormField from "@/component/formfield";
import CustomButton from "@/component/customButton";
import Footer from "@/component/footer";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { registerUser } from "@/api/api";

const Signup = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm: "",
    pincode: "",
    address: "",
    city: "",
    state: "",
    country: "",
    bankAccountNumber: "",
    accountHolderName: "",
    ifscCode: "",
    image: "",
  });
  const [isDisabled, setIsDisabled] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (form.password && form.confirm && form.email) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [form.password, form.confirm, form.email]);

  useEffect(() => {
    if (form.password && form.confirm) {
      setError(
        form.password !== form.confirm
          ? "Xác nhận mật khẩu không trùng khớp!"
          : ""
      );
      setIsDisabled(form.password !== form.confirm);
    }
  }, [form.password, form.confirm]);

  const handleSignup = async () => {
    setIsSubmitted(true); // Đánh dấu rằng người dùng đã nhấn nút

    if (!form.email || !form.password || form.password !== form.confirm) {
      return; // Dừng lại nếu form không hợp lệ
    }

    console.log("Form Data:", form);

    try {
      setIsLoading(true); // Bắt đầu hiệu ứng loading
      console.log("Starting Firebase signup...");
      // Tạo tài khoản với Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;
      console.log("Firebase signup successful, User:", user);

      // Chuẩn bị dữ liệu để gửi lên JSON Server
      const userData = {
        id: user.uid,
        email: form.email,
        pincode: form.pincode || "",
        address: form.address || "",
        city: form.city || "",
        state: form.state || "",
        country: form.country || "",
        bankAccountNumber: form.bankAccountNumber || "",
        accountHolderName: form.accountHolderName || "",
        ifscCode: form.ifscCode || "",
        image: form.image || "",
        createdAt: new Date().toISOString(),
      };

      console.log("Sending data to JSON Server...");
      // Gọi API để lưu dữ liệu vào JSON Server
      const response = await registerUser(userData);
      console.log("User added to JSON Server:", response);

      // Chuyển hướng trực tiếp đến trang signup-successfull
      router.push("/signup-successfull");
    } catch (error: any) {
      console.log("Signup failed with error:", error.code, error.message);

      // Xử lý các trường hợp lỗi cụ thể
      let errorMessage = "Đã có lỗi xảy ra khi đăng ký. Vui lòng thử lại!";
      const buttons: AlertButton[] = [{ text: "OK", style: "cancel" }];

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email này đã được sử dụng. Vui lòng dùng email khác!";
          buttons.unshift({
            text: "Đăng nhập",
            onPress: () => router.push("/sign-in"),
          });
          break;
        case "auth/invalid-email":
          errorMessage = "Email không hợp lệ. Vui lòng kiểm tra lại!";
          break;
        case "auth/weak-password":
          errorMessage =
            "Mật khẩu quá yếu. Vui lòng dùng mật khẩu mạnh hơn (tối thiểu 6 ký tự)!";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "Đăng ký hiện không khả dụng. Vui lòng thử lại sau!";
          break;
        default:
          errorMessage = error.message || errorMessage;
      }

      // Hiển thị thông báo lỗi
      console.log("Showing error alert...");
      Alert.alert("Đăng ký thất bại", errorMessage, buttons);
    } finally {
      setIsLoading(false); // Kết thúc hiệu ứng loading
    }
  };

  return (
    <SafeAreaView style={styles.fullcontainer}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F83758" />
        </View>
      ) : (
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.title}>Create An{"\n"}Account</Text>

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
            {isSubmitted && !form.email && (
              <Text style={styles.errorText}>Email không được để trống!</Text>
            )}
            {isSubmitted && error === "auth/invalid-email" && (
              <Text style={styles.errorText}>
                Email không hợp lệ. Vui lòng kiểm tra lại!
              </Text>
            )}

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
            {isSubmitted && !form.password && (
              <Text style={styles.errorText}>Mật khẩu không được để trống!</Text>
            )}
            {isSubmitted && error === "auth/weak-password" && (
              <Text style={styles.errorText}>
                Mật khẩu quá yếu. Vui lòng dùng mật khẩu mạnh hơn (tối thiểu 6 ký tự)!
              </Text>
            )}

            <FormField
              title="Confirm Password"
              value={form.confirm}
              placeholder="Confirm Password"
              handldeChangeText={(value: any) =>
                setForm({ ...form, confirm: value.nativeEvent.text })
              }
              otherStyles={styles.input}
              secureTextEntry={true}
            />
            {isSubmitted && form.password !== form.confirm && form.confirm && (
              <Text style={styles.errorText}>
                Xác nhận mật khẩu không trùng khớp!
              </Text>
            )}

            <Text style={styles.param}>
              By clicking the <Text style={styles.forgot}>Register </Text>button,
              you agree{"\n"}to the public offer.
            </Text>

            <CustomButton
              title="Create Account"
              handleChangeText={handleSignup}
              containerStyles={styles.buttonContainer}
              TextStyles={styles.buttonText}
              isLoading={isDisabled}
            />

            <Footer
              title={<Text>I Already Have an Account</Text>}
              hrefLink={
                <Text
                  style={styles.loginLink}
                  onPress={() => router.push("/sign-in")}
                >
                  Login
                </Text>
              }
            />
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  fullcontainer: {
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
  param: {
    alignSelf: "flex-start",
    marginBottom: 10,
    color: "#676767",
    fontSize: 12,
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
  loginLink: {
    color: "red",
    textDecorationLine: "underline",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
