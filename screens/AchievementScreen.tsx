import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    progress: number;
    maxProgress: number;
    isUnlocked: boolean;
    category: 'learning' | 'mastery' | 'milestone';
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    xpReward: number;
    unlockedDate?: string;
}

const achievementsData: Achievement[] = [
    // Learning Achievements
    {
        id: '4',
        title: 'First Words',
        description: 'Learn your first 10 words',
        icon: 'book-outline',
        progress: 10,
        maxProgress: 10,
        isUnlocked: true,
        category: 'learning',
        rarity: 'common',
        xpReward: 25,
        unlockedDate: '2024-01-10',
    },
    {
        id: '5',
        title: 'Vocabulary Builder',
        description: 'Learn 100 new words',
        icon: 'library-outline',
        progress: 87,
        maxProgress: 100,
        isUnlocked: false,
        category: 'learning',
        rarity: 'rare',
        xpReward: 300,
    },
    {
        id: '6',
        title: 'Grammar Guru',
        description: 'Complete all grammar lessons',
        icon: 'school-outline',
        progress: 15,
        maxProgress: 20,
        isUnlocked: false,
        category: 'learning',
        rarity: 'epic',
        xpReward: 400,
    },

    // Mastery Achievements
    {
        id: '7',
        title: 'Perfect Score',
        description: 'Get 100% on any lesson',
        icon: 'star-outline',
        progress: 1,
        maxProgress: 1,
        isUnlocked: true,
        category: 'mastery',
        rarity: 'rare',
        xpReward: 150,
        unlockedDate: '2024-01-18',
    },
    {
        id: '8',
        title: 'Speed Demon',
        description: 'Complete a lesson in under 2 minutes',
        icon: 'flash-outline',
        progress: 0,
        maxProgress: 1,
        isUnlocked: false,
        category: 'mastery',
        rarity: 'epic',
        xpReward: 250,
    },

    // Milestone Achievements
    {
        id: '11',
        title: 'Beginner Graduate',
        description: 'Complete the beginner course',
        icon: 'ribbon-outline',
        progress: 1,
        maxProgress: 1,
        isUnlocked: true,
        category: 'milestone',
        rarity: 'epic',
        xpReward: 1000,
        unlockedDate: '2024-01-25',
    },
    {
        id: '12',
        title: 'Language Legend',
        description: 'Reach fluency level',
        icon: 'medal-outline',
        progress: 0,
        maxProgress: 1,
        isUnlocked: false,
        category: 'milestone',
        rarity: 'legendary',
        xpReward: 5000,
    },
];

const categoryColors = {
    learning: '#4ECDC4',
    mastery: '#45B7D1',
    milestone: '#FFEAA7',
};

const rarityColors = {
    common: '#95A5A6',
    rare: '#3498DB',
    epic: '#9B59B6',
    legendary: '#F39C12',
};

const categoryIcons = {
    learning: 'book-outline' as keyof typeof Ionicons.glyphMap,
    mastery: 'trophy-outline' as keyof typeof Ionicons.glyphMap,
    milestone: 'flag-outline' as keyof typeof Ionicons.glyphMap,
};

export default function AchievementScreen() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const achievements = useSelector((state: { user: { allAchievements: Achievement } }) => state.user.allAchievements);

    console.log('Achievements:', achievements);

    const filteredAchievements = selectedCategory === 'all'
        ? achievementsData
        : achievementsData.filter(achievement => achievement.category === selectedCategory);

    const unlockedCount = achievementsData.filter(a => a.isUnlocked).length;
    const totalXP = achievementsData.filter(a => a.isUnlocked).reduce((sum, a) => sum + a.xpReward, 0);

    const renderProgressBar = (progress: number, maxProgress: number, isUnlocked: boolean) => {
        const percentage = (progress / maxProgress) * 100;

        return (
            <View style={styles.progressContainer}>
                <View style={styles.progressBackground}>
                    <View
                        style={[
                            styles.progressFill,
                            {
                                width: `${percentage}%`,
                                backgroundColor: isUnlocked ? '#2ECC71' : '#3498DB'
                            }
                        ]}
                    />
                </View>
                <Text style={styles.progressText}>
                    {progress}/{maxProgress}
                </Text>
            </View>
        );
    };

    const renderAchievementCard = (achievement: Achievement) => {
        const isLocked = !achievement.isUnlocked;

        return (
            <TouchableOpacity
                key={achievement.id}
                style={[
                    styles.achievementCard,
                    { borderLeftColor: categoryColors[achievement.category] },
                    isLocked && styles.lockedCard
                ]}
            >
                <View style={styles.cardHeader}>
                    <View style={[
                        styles.iconContainer,
                        { backgroundColor: isLocked ? '#BDC3C7' : categoryColors[achievement.category] }
                    ]}>
                        <Ionicons
                            name={achievement.icon}
                            size={24}
                            color={isLocked ? '#7F8C8D' : '#FFFFFF'}
                        />
                    </View>

                    <View style={styles.achievementInfo}>
                        <Text style={[styles.achievementTitle, isLocked && styles.lockedText]}>
                            {achievement.title}
                        </Text>
                        <Text style={[styles.achievementDescription, isLocked && styles.lockedText]}>
                            {achievement.description}
                        </Text>
                    </View>

                    <View style={styles.rewardContainer}>
                        <View style={[
                            styles.rarityBadge,
                            { backgroundColor: rarityColors[achievement.rarity] }
                        ]}>
                            <Text style={styles.rarityText}>{achievement.rarity.toUpperCase()}</Text>
                        </View>
                        <Text style={[styles.xpReward, isLocked && styles.lockedText]}>
                            +{achievement.xpReward} XP
                        </Text>
                    </View>
                </View>

                {renderProgressBar(achievement.progress, achievement.maxProgress, achievement.isUnlocked)}

                {achievement.isUnlocked && achievement.unlockedDate && (
                    <Text style={styles.unlockedDate}>
                        Unlocked on {achievement.unlockedDate}
                    </Text>
                )}

                {isLocked && (
                    <View style={styles.lockOverlay}>
                        <Ionicons name="lock-closed" size={20} color="#7F8C8D" />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Achievements</Text>
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{unlockedCount}</Text>
                        <Text style={styles.statLabel}>Unlocked</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{totalXP}</Text>
                        <Text style={styles.statLabel}>Total XP</Text>
                    </View>
                </View>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryFilter}
                contentContainerStyle={styles.categoryFilterContent}
            >
                <TouchableOpacity
                    style={[
                        styles.categoryButton,
                        selectedCategory === 'all' && styles.activeCategoryButton
                    ]}
                    onPress={() => setSelectedCategory('all')}
                >
                    <Ionicons name="grid-outline" size={20} color={selectedCategory === 'all' ? '#FFFFFF' : '#7F8C8D'} />
                    <Text style={[
                        styles.categoryButtonText,
                        selectedCategory === 'all' && styles.activeCategoryButtonText
                    ]}>
                        All
                    </Text>
                </TouchableOpacity>

                {Object.entries(categoryColors).map(([category, color]) => (
                    <TouchableOpacity
                        key={category}
                        style={[
                            styles.categoryButton,
                            selectedCategory === category && styles.activeCategoryButton,
                            selectedCategory === category && { backgroundColor: color }
                        ]}
                        onPress={() => setSelectedCategory(category)}
                    >
                        <Ionicons
                            name={categoryIcons[category as keyof typeof categoryIcons]}
                            size={20}
                            color={selectedCategory === category ? '#FFFFFF' : '#7F8C8D'}
                        />
                        <Text style={[
                            styles.categoryButtonText,
                            selectedCategory === category && styles.activeCategoryButtonText
                        ]}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ScrollView style={styles.achievementsList} showsVerticalScrollIndicator={false}>
                {filteredAchievements.map(renderAchievementCard)}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E9ECEF',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 15,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    statLabel: {
        fontSize: 14,
        color: '#7F8C8D',
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#E9ECEF',
        marginHorizontal: 20,
    },
    categoryFilter: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E9ECEF',
        flexGrow: 0,
    },
    categoryFilterContent: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 28,
        marginRight: 12,
        borderRadius: 20,
        backgroundColor: '#F8F9FA',
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    activeCategoryButton: {
        backgroundColor: '#3498DB',
        borderColor: '#3498DB',
    },
    categoryButtonText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '600',
        color: '#7F8C8D',
    },
    activeCategoryButtonText: {
        color: '#FFFFFF',
    },
    achievementsList: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    achievementCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    lockedCard: {
        opacity: 0.6,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    achievementInfo: {
        flex: 1,
    },
    achievementTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 4,
    },
    achievementDescription: {
        fontSize: 14,
        color: '#7F8C8D',
        lineHeight: 20,
    },
    lockedText: {
        color: '#BDC3C7',
    },
    rewardContainer: {
        alignItems: 'flex-end',
    },
    rarityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 4,
    },
    rarityText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    xpReward: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#27AE60',
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressBackground: {
        flex: 1,
        height: 8,
        backgroundColor: '#E9ECEF',
        borderRadius: 4,
        marginRight: 12,
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#7F8C8D',
        minWidth: 40,
        textAlign: 'right',
    },
    unlockedDate: {
        fontSize: 12,
        color: '#27AE60',
        fontStyle: 'italic',
    },
    lockOverlay: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
});