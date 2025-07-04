import { SPRITE_ASSETS, SPRITES_ENABLED } from '@/components/SpriteAssets';
import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface CharacterProps {
  level: number;
  size?: 'small' | 'medium' | 'large';
}

interface Cosmetic {
  id: string;
  type: 'hat' | 'outfit' | 'accessory' | 'background';
  name: string;
  unlockLevel: number;
  emoji: string;
  spriteKey: string; // Key to find sprite in SPRITE_ASSETS
}

const COSMETICS: Cosmetic[] = [
  // Hats
  { id: 'hat_cap', type: 'hat', name: 'Baseball Cap', unlockLevel: 2, emoji: '🧢', spriteKey: 'hat_cap' },
  { id: 'hat_crown', type: 'hat', name: 'Crown', unlockLevel: 5, emoji: '👑', spriteKey: 'hat_crown' },
  { id: 'hat_wizard', type: 'hat', name: 'Wizard Hat', unlockLevel: 10, emoji: '🎩', spriteKey: 'hat_wizard' },
  { id: 'hat_party', type: 'hat', name: 'Party Hat', unlockLevel: 15, emoji: '🎉', spriteKey: 'hat_party' },
  
  // Outfits
  { id: 'outfit_casual', type: 'outfit', name: 'Casual Wear', unlockLevel: 3, emoji: '👕', spriteKey: 'outfit_casual' },
  { id: 'outfit_formal', type: 'outfit', name: 'Formal Suit', unlockLevel: 7, emoji: '🤵', spriteKey: 'outfit_formal' },
  { id: 'outfit_superhero', type: 'outfit', name: 'Superhero Cape', unlockLevel: 12, emoji: '🦸', spriteKey: 'outfit_superhero' },
  { id: 'outfit_ninja', type: 'outfit', name: 'Ninja Outfit', unlockLevel: 18, emoji: '🥷', spriteKey: 'outfit_ninja' },
  
  // Accessories
  { id: 'acc_sunglasses', type: 'accessory', name: 'Cool Sunglasses', unlockLevel: 4, emoji: '😎', spriteKey: 'acc_sunglasses' },
  { id: 'acc_briefcase', type: 'accessory', name: 'Briefcase', unlockLevel: 8, emoji: '💼', spriteKey: 'acc_briefcase' },
  { id: 'acc_trophy', type: 'accessory', name: 'Trophy', unlockLevel: 20, emoji: '🏆', spriteKey: 'acc_trophy' },
  
  // Backgrounds
  { id: 'bg_forest', type: 'background', name: 'Forest', unlockLevel: 6, emoji: '🌲', spriteKey: 'bg_forest' },
  { id: 'bg_city', type: 'background', name: 'City', unlockLevel: 11, emoji: '🏙️', spriteKey: 'bg_city' },
  { id: 'bg_space', type: 'background', name: 'Space', unlockLevel: 16, emoji: '🌌', spriteKey: 'bg_space' },
];

export const getUnlockedCosmetics = (level: number): Cosmetic[] => {
  return COSMETICS.filter(cosmetic => level >= cosmetic.unlockLevel);
};

export const getNextUnlock = (level: number): Cosmetic | null => {
  const nextUnlocks = COSMETICS.filter(cosmetic => level < cosmetic.unlockLevel)
    .sort((a, b) => a.unlockLevel - b.unlockLevel);
  return nextUnlocks[0] || null;
};

// Helper function to render sprite or fallback to emoji
const renderCosmetic = (cosmetic: Cosmetic | null, size: string, style: any, fallbackStyle?: any) => {
  if (!cosmetic) return null;

  const sizeMap = {
    small: 30,
    medium: 50,
    large: 70
  };

  // Only try to load sprites if they're enabled
  if (SPRITES_ENABLED) {
    try {
      // Try to get the sprite from SPRITE_ASSETS
      let spriteSource: any = null;
      
      switch (cosmetic.type) {
        case 'hat':
          spriteSource = (SPRITE_ASSETS.hats as any)[cosmetic.spriteKey];
          break;
        case 'outfit':
          spriteSource = (SPRITE_ASSETS.outfits as any)[cosmetic.spriteKey];
          break;
        case 'accessory':
          spriteSource = (SPRITE_ASSETS.accessories as any)[cosmetic.spriteKey];
          break;
        case 'background':
          spriteSource = (SPRITE_ASSETS.backgrounds as any)[cosmetic.spriteKey];
          break;
      }
      
      if (spriteSource) {
        return (
          <Image
            source={spriteSource}
            style={[style, { width: sizeMap[size as keyof typeof sizeMap], height: sizeMap[size as keyof typeof sizeMap] }]}
            resizeMode="contain"
          />
        );
      }
    } catch (error) {
      // If sprite loading fails, fall back to emoji
      console.log(`Sprite not found for ${cosmetic.spriteKey}, using emoji fallback`);
    }
  }

  // Fallback to emoji
  return (
    <ThemedText style={fallbackStyle || style}>
      {cosmetic.emoji}
    </ThemedText>
  );
};

// Helper function to render base character
const renderBaseCharacter = (equippedOutfit: Cosmetic | null, size: string, emojiSize: number) => {
  const sizeMap = {
    small: 40,
    medium: 60,
    large: 80
  };

  // Only try to load sprites if they're enabled
  if (SPRITES_ENABLED) {
    try {
      if (equippedOutfit) {
        const spriteSource = (SPRITE_ASSETS.outfits as any)[equippedOutfit.spriteKey];
        if (spriteSource) {
          return (
            <Image
              source={spriteSource}
              style={{ width: sizeMap[size as keyof typeof sizeMap], height: sizeMap[size as keyof typeof sizeMap] }}
              resizeMode="contain"
            />
          );
        }
      } else {
        // Default character sprite
        const defaultSprite = (SPRITE_ASSETS.characters as any)?.default;
        if (defaultSprite) {
          return (
            <Image
              source={defaultSprite}
              style={{ width: sizeMap[size as keyof typeof sizeMap], height: sizeMap[size as keyof typeof sizeMap] }}
              resizeMode="contain"
            />
          );
        }
      }
    } catch (error) {
      console.log('Character sprite not found, using emoji fallback');
    }
  }

  // Fallback to emoji
  return (
    <ThemedText style={[styles.characterEmoji, { fontSize: emojiSize * 1.5 }]}>
      {equippedOutfit ? equippedOutfit.emoji : '🧑'}
    </ThemedText>
  );
};

export const Character: React.FC<CharacterProps> = ({ level, size = 'medium' }) => {
  const unlockedCosmetics = getUnlockedCosmetics(level);
  
  // Get the best unlocked cosmetic of each type
  const equippedHat = unlockedCosmetics
    .filter(c => c.type === 'hat')
    .sort((a, b) => b.unlockLevel - a.unlockLevel)[0];
    
  const equippedOutfit = unlockedCosmetics
    .filter(c => c.type === 'outfit')
    .sort((a, b) => b.unlockLevel - a.unlockLevel)[0];
    
  const equippedAccessory = unlockedCosmetics
    .filter(c => c.type === 'accessory')
    .sort((a, b) => b.unlockLevel - a.unlockLevel)[0];
    
  const equippedBackground = unlockedCosmetics
    .filter(c => c.type === 'background')
    .sort((a, b) => b.unlockLevel - a.unlockLevel)[0];

  const sizeStyles = {
    small: { width: 60, height: 60 },
    medium: { width: 100, height: 100 },
    large: { width: 140, height: 140 }
  };

  const emojiSizes = {
    small: 12,
    medium: 20,
    large: 28
  };

  return (
    <View style={[styles.characterContainer, sizeStyles[size]]}>
      {/* Background */}
      {equippedBackground && (
        <View style={styles.backgroundContainer}>
          {renderCosmetic(
            equippedBackground, 
            size, 
            styles.backgroundSprite,
            [styles.backgroundEmoji, { fontSize: emojiSizes[size] * 3 }]
          )}
        </View>
      )}
      
      {/* Base Character */}
      <View style={styles.characterBase}>
        {/* Outfit/Body */}
        {renderBaseCharacter(equippedOutfit, size, emojiSizes[size])}
        
        {/* Hat */}
        {equippedHat && (
          <View style={[styles.hatContainer, { top: size === 'small' ? -8 : size === 'medium' ? -12 : -16 }]}>
            {renderCosmetic(
              equippedHat, 
              size, 
              styles.hatSprite,
              [styles.hatEmoji, { fontSize: emojiSizes[size] }]
            )}
          </View>
        )}
        
        {/* Accessory */}
        {equippedAccessory && (
          <View style={[styles.accessoryContainer, { right: size === 'small' ? -5 : size === 'medium' ? -8 : -12 }]}>
            {renderCosmetic(
              equippedAccessory, 
              size, 
              styles.accessorySprite,
              [styles.accessoryEmoji, { fontSize: emojiSizes[size] * 0.8 }]
            )}
          </View>
        )}
      </View>
      
      {/* Level Badge */}
      <View style={styles.levelBadge}>
        <ThemedText style={[styles.levelText, { fontSize: size === 'small' ? 8 : size === 'medium' ? 10 : 12 }]}>
          Lv.{level}
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  characterContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(0, 122, 255, 0.2)',
  },
  backgroundContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundSprite: {
    position: 'absolute',
    opacity: 0.3,
  },
  backgroundEmoji: {
    position: 'absolute',
    opacity: 0.3,
  },
  characterBase: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  characterEmoji: {
    textAlign: 'center',
  },
  hatContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hatSprite: {
    position: 'absolute',
  },
  hatEmoji: {
    position: 'absolute',
    textAlign: 'center',
  },
  accessoryContainer: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accessorySprite: {
    position: 'absolute',
  },
  accessoryEmoji: {
    position: 'absolute',
    bottom: 0,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#fff',
  },
  levelText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export { COSMETICS };
export type { Cosmetic };

