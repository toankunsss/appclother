import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
// import * as Google from "expo-auth-session/providers/google";
import { ggImag } from "@/contants/image/img";
import { facebookImag } from "@/contants/image/img";
import { appleImag } from "@/contants/image/img";
import {
  getAuth,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig"; // Đảm bảo bạn đã cấu hình Firebase

WebBrowser.maybeCompleteAuthSession();

const Footer = ({ title, hrefLink }) => {
  const [userInfo, setUserInfo] = useState(null);

  // const [request, response, promptAsync] = Google.useAuthRequest({
  //   clientId:
  //     "594142675816-qkvhsutfv3612ce1v9h8ps1gnieu33fs.apps.googleusercontent.com", // Thay bằng Web Client ID của Firebase
  //   webClientId:
  //     "594142675816-qkvhsutfv3612ce1v9h8ps1gnieu33fs.apps.googleusercontent.com",
  // });

  // useEffect(() => {
  //   if (response?.type === "success") {
  //     const { accessToken } = response.authentication;
  //     const credential = GoogleAuthProvider.credential(null, accessToken);
  //     signInWithCredential(auth, credential)
  //       .then((userCredential) => {
  //         setUserInfo(userCredential.user);
  //       })
  //       .catch((error) => console.error("Login Error:", error));
  //   }
  // }, [response]);

  return (
    <View style={styles.container}>
      <Text>- OR Continue with -</Text>
      <View style={styles.iconContainer}>
        <TouchableOpacity>
          <Image source={facebookImag} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {}}>
          <Image source={ggImag} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image source={appleImag} style={styles.icon} />
        </TouchableOpacity>
      </View>
      {userInfo ? (
        <Text>Xin chào,!</Text>
      ) : (
        <Text>
          {title} {hrefLink}
        </Text>
      )}
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 20,
  },
  iconContainer: {
    flexDirection: "row",
    marginVertical: 20,
    gap: 20,
  },
  icon: {
    width: 40,
    height: 40,
  },
});
