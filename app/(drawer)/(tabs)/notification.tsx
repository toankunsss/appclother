

import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useNotification } from "@/context/NotificationContext";

const NotificationScreen = () => {
  const router = useRouter();
  const { notifications, markAllAsRead } = useNotification();

  useEffect(() => {
    markAllAsRead();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notification</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {notifications.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>No notifications.</Text>
        ) : (
          notifications.map((item, idx) => (
            <View key={item.id || idx} style={styles.card}>
              <Text style={styles.cardTitle}>{item.message}</Text>
              <Text style={styles.cardDesc}>
                {item.created_at ? new Date(item.created_at).toLocaleString() : "No date available"}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafbfc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
    backgroundColor: '#fafbfc',
  },
  backBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#222',
  },
  cardDesc: {
    fontSize: 14,
    color: '#888',
  },
});
