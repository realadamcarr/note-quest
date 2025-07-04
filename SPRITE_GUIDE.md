# Custom Sprite Implementation Guide

## ✅ Sprite System Status: SAFE MODE (SPRITES DISABLED)

**IMPORTANT**: Sprites are currently disabled to prevent Android 500 errors. The app will use emojis until you add proper sprite images.

Your Note Quest app has a complete sprite system that will:
- Load custom sprites from the assets/sprites directory
- Automatically fall back to emojis if sprites are missing or invalid
- Support all cosmetic types (hats, outfits, accessories, backgrounds)
- Scale properly for different character sizes (small, medium, large)

## 🔧 How to Enable Your Custom Sprites:

1. **Add your sprite images** to the correct directories (see structure below)
2. **Enable sprites** by changing `SPRITES_ENABLED = true` in `components/SpriteAssets.ts`
3. **Uncomment the require() statements** in the same file for the sprites you've added
4. **Test on Android** to ensure your sprites load properly

## ⚠️ Android Sprite Requirements:
- **Format**: PNG with transparency
- **Base Character**: 64x64 pixels
- **Hats**: 64x32 pixels (positioned above character)
- **Outfits**: 64x64 pixels (overlays character)
- **Accessories**: 32x32 pixels (positioned near character)
- **Backgrounds**: 128x128 pixels
- **Must be valid PNG files** (not corrupted or empty placeholder files)
- **Use RGB or RGBA color mode** (avoid indexed color or unusual formats)
- **Keep file sizes reasonable** (under 1MB each, preferably under 100KB)
- **Test on Android device/emulator** before deploying

## Directory Structure:
```
assets/sprites/
├── characters/
│   └── default.png
├── hats/
│   ├── baseball_cap.png
│   ├── crown.png
│   ├── wizard_hat.png
│   └── party_hat.png
├── outfits/
│   ├── casual.png
│   ├── formal.png
│   ├── superhero.png
│   └── ninja.png
├── accessories/
│   ├── sunglasses.png
│   ├── briefcase.png
│   └── trophy.png
└── backgrounds/
    ├── forest.png
    ├── city.png
    └── space.png
```

## How to Add Your Sprites:
1. Create your sprite images using any graphics software (Photoshop, GIMP, Figma, etc.)
2. **IMPORTANT**: Save as proper PNG files (RGB/RGBA, not indexed color)
3. Save them with the exact filenames shown above
4. Place them in the correct directories
5. **Enable sprites** by setting `SPRITES_ENABLED = true` in `components/SpriteAssets.ts`
6. **Uncomment the require() statements** for your sprite files
7. **Test on Android** to ensure they load without errors

## Sprite Creation Tips:
- Use consistent art style across all sprites
- Keep backgrounds simple and not too busy
- Use transparency (alpha channel) for non-rectangular sprites
- Consider pixel art style for retro gaming feel
- Test sprites at different sizes (small, medium, large character display)

## Free Sprite Resources:
- OpenGameArt.org
- Kenney.nl (free game assets)
- Itch.io (many free sprite packs)
- Pixabay (free images you can convert to sprites)

## How the Sprite System Works:

1. **Automatic Loading**: Sprites are loaded via the `SpriteAssets.ts` file which maps cosmetic IDs to their respective sprite files
2. **Smart Fallback**: If a sprite file is missing or fails to load, the app automatically falls back to emoji display
3. **Type Safety**: All cosmetics have a `spriteKey` property that corresponds to their sprite file name
4. **Performance**: Sprites are loaded using React Native's optimized Image component with proper resizing

## Current Status:
🔧 Sprite system implemented but **DISABLED** for safety  
📱 App runs smoothly on Android using emoji fallbacks  
✅ Character component ready for sprite rendering  
✅ CosmeticsShowcase ready for sprite display  
✅ Safe fallback system prevents crashes  
⚠️ **You need to add proper PNG files and enable sprites manually**

## Step-by-Step Sprite Setup:

1. **Create/Find your sprite images** (see recommendations above)
2. **Save them to the exact paths** shown in the directory structure
3. **Edit `components/SpriteAssets.ts`**:
   - Change `SPRITES_ENABLED = false` to `SPRITES_ENABLED = true`
   - Uncomment the `require()` lines for sprites you've added
4. **Test incrementally**: Enable one category at a time to identify problem files
5. **Test on Android**: Make sure no 500 errors occur

## Example: Enabling Just the Hat Sprites

If you have a hat sprite ready, here's how to enable just that category:

1. **Add your hat image**: `assets/sprites/hats/baseball_cap.png`
2. **Edit SpriteAssets.ts**:
```typescript
export const SPRITES_ENABLED = true; // Enable sprites

export const SPRITE_ASSETS = {
  // ... other categories stay commented out ...
  
  // Hats - uncomment the ones you have
  hats: {
    hat_cap: require('@/assets/sprites/hats/baseball_cap.png'), // ✅ Enable this one
    // hat_crown: require('@/assets/sprites/hats/crown.png'),   // ❌ Keep commented if you don't have it
    // hat_wizard: require('@/assets/sprites/hats/wizard_hat.png'),
    // hat_party: require('@/assets/sprites/hats/party_hat.png'),
  },
  
  // ... other categories stay empty/commented ...
};
```

This way you can test one sprite at a time and avoid errors!

The sprite system is ready - you just need to add proper image files and enable them!
