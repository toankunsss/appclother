import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
const SignupSuccessful = () => {
  const navigation = useRouter();

  const handleProceedToLogin = () => {
    navigation.navigate('/(auth)/sign-in');
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image source={require('../../assets/images/check.png')} style={styles.icon} />
      </View>
      <Text style={styles.title}>Registration Successful</Text>
      <Text style={styles.subtitle}>You have successfully registered your account.</Text>
      <TouchableOpacity style={styles.button} onPress={handleProceedToLogin}>
        <Text style={styles.buttonText}>Proceed to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  icon: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#0056b3',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SignupSuccessful;