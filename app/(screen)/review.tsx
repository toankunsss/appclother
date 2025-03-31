import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getReviewsByProductId } from "@/api/api";

// Định nghĩa interface cho Review
interface ReviewType {
  review_id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

// Định nghĩa interface cho Product (nếu bạn có thêm thuộc tính khác của product)
interface ProductType {
  product_id: number;
  name: string;
  // Thêm các thuộc tính khác của product nếu cần
}

// Định nghĩa interface cho rating data
interface RatingData {
  stars: number;
  count: number;
}

const ReviewScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [product, setProduct] = useState<ProductType | null>(null);

  useEffect(() => {
    if (params.product) {
      const productData: ProductType = JSON.parse(params.product as string);
      setProduct(productData);
      fetchReviews(productData.product_id);
    }
  }, [params]);

  const fetchReviews = async (productId: number): Promise<void> => {
    const reviewData: ReviewType[] = await getReviewsByProductId(productId);
    setReviews(reviewData);
  };

  // Tính điểm trung bình và số lượng review
  const averageRating: number =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;
  const reviewCount: number = reviews.length;

  // Tính số lượng đánh giá theo số sao
  const ratingData: RatingData[] = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((review) => review.rating === stars).length,
  }));

  const renderStars = (rating: number): JSX.Element => (
    <View style={{ flexDirection: "row" }}>
      {[...Array(5)].map((_, i) => (
        <FontAwesome
          key={i}
          name="star"
          size={16}
          color={i < rating ? "#000" : "#ccc"}
        />
      ))}
    </View>
  );

  if (!product) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} />
        </TouchableOpacity>
        <Text style={styles.title}>Rating and Review</Text>
      </View>

      {/* Thông tin sản phẩm */}
      <Text style={styles.productName}>{product.name}</Text>
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingText}>{averageRating.toFixed(1)}</Text>
        {renderStars(Math.round(averageRating))}
        <Text style={styles.reviewCount}>{reviewCount} reviews</Text>
      </View>

      {/* Biểu đồ đánh giá */}
      {ratingData.map((item) => (
        <View key={item.stars} style={styles.ratingRow}>
          {renderStars(item.stars)}
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progress,
                {
                  width: `${
                    reviewCount > 0 ? (item.count / reviewCount) * 100 : 0
                  }%`,
                },
              ]}
            />
          </View>
          <Text style={styles.ratingCount}>{item.count}</Text>
        </View>
      ))}

      {/* Danh sách đánh giá */}
      <FlatList
        data={reviews}
        keyExtractor={(item: ReviewType) => item.review_id.toString()}
        renderItem={({ item }: { item: ReviewType }) => (
          <View style={styles.reviewItem}>
            <Image source={{ uri: "" }} style={styles.avatar} />
            <View style={styles.reviewContent}>
              <Text style={styles.userName}>
                {item.user_id === 1 ? "John Doe" : "Jane Smith"}
              </Text>
              {renderStars(item.rating)}
              <Text style={styles.comment}>{item.comment}</Text>
            </View>
            <Text style={styles.date}>
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default ReviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  productName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 32,
    fontWeight: "bold",
    marginRight: 5,
  },
  reviewCount: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#ddd",
    borderRadius: 5,
    marginHorizontal: 10,
  },
  progress: {
    height: 8,
    backgroundColor: "#000",
    borderRadius: 5,
  },
  ratingCount: {
    fontSize: 14,
    fontWeight: "bold",
  },
  reviewItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  reviewContent: {
    flex: 1,
  },
  userName: {
    fontWeight: "bold",
  },
  comment: {
    color: "#555",
    marginTop: 5,
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
});
