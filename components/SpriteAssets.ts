// Sprite asset mappings
// You can replace these with your actual sprite files

// Set this to true once you've added your custom sprite images
export const SPRITES_ENABLED = false;

export const SPRITE_ASSETS = {
  // Base Characters
  characters: {
    // default: require('@/assets/sprites/characters/default.png'),
    // Add more character variations here
  },
  
  // Hats
  hats: {
    // hat_cap: require('@/assets/sprites/hats/baseball_cap.png'),
    // hat_crown: require('@/assets/sprites/hats/crown.png'), 
    // hat_wizard: require('@/assets/sprites/hats/wizard_hat.png'),
    // hat_party: require('@/assets/sprites/hats/party_hat.png'),
  },
  
  // Outfits
  outfits: {
    // outfit_casual: require('@/assets/sprites/outfits/casual.png'),
    // outfit_formal: require('@/assets/sprites/outfits/formal.png'),
    // outfit_superhero: require('@/assets/sprites/outfits/superhero.png'),
    // outfit_ninja: require('@/assets/sprites/outfits/ninja.png'),
  },
  
  // Accessories
  accessories: {
    // acc_sunglasses: require('@/assets/sprites/accessories/sunglasses.png'),
    // acc_briefcase: require('@/assets/sprites/accessories/briefcase.png'),
    // acc_trophy: require('@/assets/sprites/accessories/trophy.png'),
  },
  
  // Backgrounds
  backgrounds: {
    // bg_forest: require('@/assets/sprites/backgrounds/forest.png'),
    // bg_city: require('@/assets/sprites/backgrounds/city.png'),
    // bg_space: require('@/assets/sprites/backgrounds/space.png'),
  },
};

// Fallback emojis for when sprites aren't available
export const EMOJI_FALLBACKS = {
  characters: {
    default: '🧑',
  },
  hats: {
    hat_cap: '🧢',
    hat_crown: '👑',
    hat_wizard: '🎩',
    hat_party: '🎉',
  },
  outfits: {
    outfit_casual: '👕',
    outfit_formal: '🤵',
    outfit_superhero: '🦸',
    outfit_ninja: '🥷',
  },
  accessories: {
    acc_sunglasses: '😎',
    acc_briefcase: '💼',
    acc_trophy: '🏆',
  },
  backgrounds: {
    bg_forest: '🌲',
    bg_city: '🏙️',
    bg_space: '🌌',
  },
};
