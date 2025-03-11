// src/modules/recipes.js

const recipes = [
  // BAKING RECIPES:
  {
    name: 'bread',
    burnedName: 'burnedBread',
    ingredients: ['dough'],    // requires dough to bake
    bakingTime: 5000,
  },
  {
    name: 'cookie',
    burnedName: 'burnedCookie',
    ingredients: ['cookieDough'],  // requires cookieDough to bake
    bakingTime: 3000,
  },

  // MIXING RECIPES:
  {
    name: 'dough',
    ingredients: ['flour'],    // mixing flour -> dough
    mixTime: 3000,             // 3 seconds to mix
  },
  {
    name: 'cookieDough',
    ingredients: ['flour', 'sugar'], // mixing flour + sugar -> cookieDough
    mixTime: 4000,                   // 4 seconds to mix
  },
];

// For BAKING (already in your code):
export function findRecipe(ingredients) {
  return recipes.find(recipe => {
    // Must have a bakingTime to be a baking recipe
    if (!recipe.bakingTime) return false;
    if (recipe.ingredients.length !== ingredients.length) return false;
    return recipe.ingredients.every(ing => ingredients.includes(ing));
  }) || null;
}

// For MIXING (NEW):
export function findMixerRecipe(ingredients) {
  return recipes.find(recipe => {
    // Must have a mixTime to be a valid mixer recipe
    if (!recipe.mixTime) return false;
    if (recipe.ingredients.length !== ingredients.length) return false;
    return recipe.ingredients.every(ing => ingredients.includes(ing));
  }) || null;
}

export default recipes;
