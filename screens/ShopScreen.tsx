import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Image,
    Modal,
} from "react-native"
import { useDispatch, useSelector } from "react-redux";
import { ShopItem } from "../types/ShopItem";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { GlobalStyles } from "../constants/styles";
import { User } from "../types/User";
import buyShopItem from "../api/shops/buyShopItem";
import { buyItem, equipItem } from "../store/userSlice";
import Toast from "react-native-toast-message";
import { equipItemToUser } from "../api/user";
import buyBoost from "../api/shops/buyBoost";
import { buyBoost as buyBoostReducer } from "../store/userSlice";


export default function ShopScreen() {
    const shopItems = useSelector((state: { user: { shopItem: ShopItem[] } }) => state.user.shopItem);
    const userData = useSelector((state: { user: { userInfo: Partial<User> } }) => state.user.userInfo);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("")
    const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null)
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const dispatch = useDispatch();

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

    const handleEquipItem = async (item: ShopItem) => {
        if (userData.profilePicture === item.image) {
            Toast.show({
                type: 'info',
                text1: 'Item Sudah Dipakai',
                text2: `Anda sudah memakai ${item.name}.`,
            })
            return;
        }

        try {
            await equipItemToUser(userData._id, item._id);
            dispatch(equipItem({ itemId: item._id }));

            Toast.show({
                type: 'success',
                text1: 'Item Dipakai',
                text2: `Anda telah memakai ${item.name}.`,
            })
        } catch (error) {
            console.error("Error equipping item:", error);
            Toast.show({
                type: 'error',
                text1: 'Gagal Memakai Item',
                text2: `Terjadi kesalahan saat memakai ${item.name}. Silakan coba lagi.`,
            })
            return;
        }
    }

    const confirmPurchase = async () => {
        if (selectedItem && userData.totalGems >= selectedItem.price) {
            // setUserCoins(userCoins - selectedItem.price)
            // Here you would add logic to give the user their purchased item

            try {
                await buyShopItem({ userId: userData._id, itemId: selectedItem._id });

                dispatch(buyItem({ itemId: selectedItem._id }));

                Toast.show({
                    type: 'success',
                    text1: 'Pembelian Berhasil',
                    text2: `Anda telah membeli ${selectedItem.name} seharga ${selectedItem.price} koin.`,
                })
            } catch (error) {
                console.error("error message", error);

            } finally {
                setShowPurchaseModal(false)
            }
            // Show success message or animation
        }
    }

    const confirmPurchaseBoost = async () => {
        if (selectedItem && userData.totalGems >= selectedItem.price) {
            try {
                const response = await buyBoost({ userId: userData._id, itemId: selectedItem._id });
                console.log("Boost response:", response.user.activeBoost);
                dispatch(buyBoostReducer({
                    boostType: response.user.activeBoost.boostType,
                    startedAt: response.user.activeBoost.startedAt,
                    expiresAt: response.user.activeBoost.expiresAt,
                    itemId: selectedItem._id,
                }))

                Toast.show({
                    type: 'success',
                    text1: 'Pembelian Boost Berhasil',
                    text2: `Anda dapat menikmati 2x XP selama 15 menit.`,
                })
            } catch (error) {
                console.error("Error buying boost:", error);
                Toast.show({
                    type: 'error',
                    text1: 'Gagal Membeli Boost',
                    text2: `Terjadi kesalahan saat membeli boost. Silakan coba lagi.`,
                })
            } finally {
                setShowPurchaseModal(false);
            }
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
                    <View style={styles.itemCard} key={item._id}>
                        <Pressable key={item._id} onPress={() => handlePurchase(item)}>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.itemImage}
                            />
                        </Pressable>
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
                                (userData.totalGems < item.price || userData.profilePicture === item.image) && !userData.purchases.find((purchase) => purchase.item === item._id) ? styles.disabledBuyButton : {}
                            ]}
                            onPress={userData.purchases.find((purchase) => purchase.item === item._id) ?
                                () => handleEquipItem(item) :
                                () => handlePurchase(item)
                            }
                            disabled={(userData.totalGems < item.price || userData.profilePicture === item.image) && !userData.purchases.find((purchase) => purchase.item === item._id)}
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

                                {userData.purchases.find((purchase) => purchase.item === selectedItem._id.toString()) ? (
                                    <Text style={styles.purchasedItem}>Anda sudah membeli item ini</Text>
                                ) : userData.totalGems < selectedItem.price ? (
                                    <Text style={styles.insufficientFunds}>Koin tidak cukup</Text>
                                ) : null}

                                <View style={styles.modalButtons}>
                                    <Pressable style={styles.cancelButton} onPress={() => setShowPurchaseModal(false)}>
                                        <Text style={styles.cancelButtonText}>Batal</Text>
                                    </Pressable>

                                    <Pressable
                                        style={[styles.confirmButton, userData.totalGems < selectedItem.price && styles.disabledConfirmButton]}
                                        onPress={selectedItem.category === "Boost" ? confirmPurchaseBoost : confirmPurchase}
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
        // padding: 20,
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
        paddingHorizontal: 20,
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
        fontFamily: "Inter-Bold",
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
        width: 30,
        height: 30,
        marginRight: 8,
    },
    coinText: {
        fontFamily: "Inter-Bold",
        fontSize: 16,
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
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    itemCard: {
        flexDirection: "row",
        alignItems: "center",
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
        color: "#333",
        marginBottom: 4,
        fontFamily: "Inter-Medium",
    },
    itemDescription: {
        fontSize: 13,
        color: "#666",
        marginBottom: 8,
        fontFamily: "Inter-Regular",
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4
    },
    priceIcon: {
        width: 16,
        height: 16,
        marginRight: 4,
    },
    priceText: {
        fontFamily: "Inter-Medium",
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
        fontFamily: "Inter-Medium",
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
        fontFamily: "Inter-Bold",
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
        fontFamily: "Inter-Bold",
        marginBottom: 8,
        color: "#333",
    },
    modalItemDescription: {
        fontSize: 14,
        color: "#666",
        fontFamily: "Inter-Regular",
        marginBottom: 16,
        textAlign: "center",
        lineHeight: 20,
    },
    modalPriceContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    modalPriceText: {
        fontSize: 18,
        fontFamily: "Inter-Medium",
        color: "#333",
    },
    purchasedItem: {
        color: "#58cc02",
        marginBottom: 16,
        fontFamily: "Inter-Medium",
        backgroundColor: "#e6ffe6",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    insufficientFunds: {
        color: "#e74c3c",
        marginBottom: 16,
        fontFamily: "Inter-Medium",
        backgroundColor: "#ffe6e6",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
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
        fontFamily: "Inter-Medium"
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
        fontFamily: "Inter-Medium"
    },
})
