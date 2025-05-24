import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Image,
    Modal,
} from "react-native"
import { useSelector } from "react-redux";
import { ShopItem } from "../types/ShopItem";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { GlobalStyles } from "../constants/styles";
import { User } from "../types/User";


export default function ShopScreen() {
    const shopItems = useSelector((state: { user: { shopItem: ShopItem[] } }) => state.user.shopItem);
    const userData = useSelector((state: { user: { userInfo: Partial<User> } }) => state.user.userInfo);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("")
    const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null)
    const [showPurchaseModal, setShowPurchaseModal] = useState(false)

    useEffect(() => {
        setSelectedCategory("Cosmetic")
    }, [shopItems]);

    if (!shopItems || shopItems.length === 0) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    const filteredItems = shopItems.filter((item) => item.category === selectedCategory)

    const handlePurchase = (item: ShopItem) => {
        setSelectedItem(item)
        setShowPurchaseModal(true)
    }

    const confirmPurchase = () => {
        if (selectedItem && userData.totalGems >= selectedItem.price) {
            // setUserCoins(userCoins - selectedItem.price)
            // Here you would add logic to give the user their purchased item
            setShowPurchaseModal(false)
            // Show success message or animation
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Toko</Text>
                <View style={styles.coinContainer}>
                    <Image source={require("../assets/gamification/gems.png")} style={styles.coinIcon} />
                    <Text style={styles.coinText}>{userData.totalGems}</Text>
                </View>
            </View>

            {/* Category Tabs */}
            <View style={styles.categoryTabs}>
                <Pressable
                    style={[styles.categoryTab, selectedCategory === "Cosmetic" && styles.selectedCategoryTab]}
                    onPress={() => setSelectedCategory("Cosmetic")}
                >
                    <Ionicons name="person-circle-outline" size={24} color={selectedCategory === "Cosmetic" ? "#fff" : "#555"} />
                    <Text style={[styles.categoryText, selectedCategory === "Cosmetic" && styles.selectedCategoryText]}>
                        Avatar
                    </Text>
                </Pressable>

                <Pressable
                    style={[styles.categoryTab, selectedCategory === "Boost" && styles.selectedCategoryTab]}
                    onPress={() => setSelectedCategory("Boost")}
                >
                    <Ionicons name="flash-outline" size={24} color={selectedCategory === "Boost" ? "#fff" : "#555"} />
                    <Text style={[styles.categoryText, selectedCategory === "Boost" && styles.selectedCategoryText]}>
                        Boost
                    </Text>
                </Pressable>

                <Pressable
                    style={[styles.categoryTab, selectedCategory === "Streak" && styles.selectedCategoryTab]}
                    onPress={() => setSelectedCategory("Streak")}
                >
                    <Ionicons name="battery-full" size={24} color={selectedCategory === "Streak" ? "#fff" : "#555"} />
                    <Text style={[styles.categoryText, selectedCategory === "Streak" && styles.selectedCategoryText]}>
                        Streaks
                    </Text>
                </Pressable>
            </View>

            {/* Store Items */}
            <ScrollView style={styles.itemsContainer}>
                {filteredItems.map((item) => (
                    <View key={item._id} style={styles.itemCard}>
                        <Image
                            source={{ uri: item.image }}
                            style={styles.itemImage}
                        />
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemDescription} numberOfLines={3} ellipsizeMode="tail">
                                {item.description}
                            </Text>
                            <View style={styles.priceContainer}>
                                <Image source={require("../assets/gamification/gems.png")} style={styles.priceIcon} />
                                <Text style={styles.priceText}>{item.price}</Text>
                            </View>
                        </View>
                        <Pressable
                            style={[
                                styles.buyButton,
                                (userData.totalGems < item.price &&
                                    userData.purchases.find(
                                        (purchase) => purchase.item !== item._id
                                    ))
                                && styles.disabledBuyButton
                            ]}
                            onPress={() => handlePurchase(item)}
                            disabled={userData.totalGems < item.price || userData.profilePicture === item.image}
                        >
                            <Text style={styles.buyButtonText}>
                                {userData.profilePicture === item.image ? "Sudah dipakai" : (
                                    userData.purchases.find((purchase) => purchase.item === item._id) ? "Pakai" : "Beli"
                                )}
                            </Text>
                        </Pressable>
                    </View>
                ))}
            </ScrollView>

            {/* Purchase Confirmation Modal */}
            <Modal visible={showPurchaseModal} transparent={true} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Konfirmasi Pembelian</Text>
                        {selectedItem && (
                            <>
                                <Image
                                    source={{ uri: selectedItem.image }}
                                    style={styles.modalImage}
                                />
                                <Text style={styles.modalItemName}>{selectedItem.name}</Text>
                                <Text style={styles.modalItemDescription}>{selectedItem.description}</Text>
                                <View style={styles.modalPriceContainer}>
                                    <Image source={require("../assets/gamification/gems.png")} style={styles.priceIcon} />
                                    <Text style={styles.modalPriceText}>{selectedItem.price}</Text>
                                </View>

                                {userData.totalGems < selectedItem.price ? (
                                    <Text style={styles.insufficientFunds}>Insufficient coins</Text>
                                ) : null}

                                <View style={styles.modalButtons}>
                                    <Pressable style={styles.cancelButton} onPress={() => setShowPurchaseModal(false)}>
                                        <Text style={styles.cancelButtonText}>Batal</Text>
                                    </Pressable>

                                    <Pressable
                                        style={[styles.confirmButton, userData.totalGems < selectedItem.price && styles.disabledConfirmButton]}
                                        onPress={confirmPurchase}
                                        disabled={userData.totalGems < selectedItem.price}
                                    >
                                        <Text style={styles.confirmButtonText}>Beli</Text>
                                    </Pressable>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f0f0f0",
    },
    title: {
        fontSize: 24,
        fontFamily: "Inter-Bold",
        color: "#333",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#333",
    },
    coinContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    coinIcon: {
        width: 20,
        height: 20,
        marginRight: 4,
    },
    coinText: {
        fontWeight: "600",
        color: "#333",
    },
    categoryTabs: {
        flexDirection: "row",
        backgroundColor: "#fff",
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    categoryTab: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        marginHorizontal: 4,
        borderRadius: 8,
        backgroundColor: "#f0f0f0",
    },
    selectedCategoryTab: {
        backgroundColor: GlobalStyles.colors.accent,
    },
    categoryText: {
        marginLeft: 6,
        color: "#555",
        fontFamily: "Inter-Bold",
    },
    selectedCategoryText: {
        color: "#fff",
    },
    itemsContainer: {
        flex: 1,
        padding: 16,
    },
    itemCard: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    itemImage: {
        width: 70,
        height: 70,
        borderRadius: 8,
        backgroundColor: "#f0f0f0",
    },
    itemDetails: {
        flex: 1,
        marginLeft: 16,
        justifyContent: "center",
    },
    itemName: {
        fontSize: 16,
        fontWeight: "700",
        color: "#333",
        marginBottom: 4,
        fontFamily: "Inter-Bold",
    },
    itemDescription: {
        fontSize: 14,
        color: "#666",
        marginBottom: 8,
        fontFamily: "Inter-Regular",
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    priceIcon: {
        width: 16,
        height: 16,
        marginRight: 4,
    },
    priceText: {
        fontWeight: "600",
        color: "#333",
    },
    buyButton: {
        backgroundColor: "#58cc02",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        justifyContent: "center",
        alignSelf: "center",
        marginLeft: 8,
        width: "26%"
    },
    disabledBuyButton: {
        backgroundColor: "#cccccc",
        width: "auto",
    },
    buyButtonText: {
        color: "#fff",
        fontWeight: "700",
        fontFamily: "Inter-Bold",
        lineHeight: 20,
        textAlign: "center",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 24,
        width: "80%",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 16,
        color: "#333",
    },
    modalImage: {
        width: 100,
        height: 100,
        marginBottom: 16,
        borderRadius: 8,
    },
    modalItemName: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 8,
        color: "#333",
    },
    modalItemDescription: {
        fontSize: 14,
        color: "#666",
        marginBottom: 16,
        textAlign: "center",
    },
    modalPriceContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
    },
    modalPriceText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#333",
    },
    insufficientFunds: {
        color: "#e74c3c",
        marginBottom: 16,
        fontWeight: "600",
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    cancelButton: {
        backgroundColor: "#f0f0f0",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        flex: 1,
        marginRight: 8,
        alignItems: "center",
    },
    cancelButtonText: {
        color: "#333",
        fontWeight: "600",
    },
    confirmButton: {
        backgroundColor: "#58cc02",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        flex: 1,
        marginLeft: 8,
        alignItems: "center",
    },
    disabledConfirmButton: {
        backgroundColor: "#cccccc",
    },
    confirmButtonText: {
        color: "#fff",
        fontWeight: "600",
    },
})
