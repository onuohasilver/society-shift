const adjectives = [
  'Cool',
  'Smart',
  'Happy',
  'Fast',
  'Bright',
  'Steady',
  'Chill',
  'Nice',
  'Good',
  'Brave',
  'Calm',
  'Clever',
  'Eager',
  'Faithful',
  'Gentle',
  'Kind',
  'Lively',
  'Neat',
  'Polite',
  'Proud',
  'Silly',
  'Wise',
  'Zany',
  'Angry',
  'Clumsy',
  'Evil',
  'Fierce',
  'Grumpy',
  'Helpful',
  'Jolly',
  'Lazy',
  'Mysterious',
  'Nervous',
  'Rude',
  'Silly',
  'Tense',
  'Worried',
  'Anxious',
  'Bored',
  'Crazy',
  'Dizzy',
  'Foolish',
  'Gloomy',
  'Hungry',
  'Itchy',
  'Jealous',
  'Lonely',
  'Muddy',
  'Scary',
  'Tired',
  'Ugly',
  'Worried',
  'Yucky',
]
const nouns = [
  'Cat',
  'Dog',
  'Bird',
  'Fish',
  'Lion',
  'Tiger',
  'Elephant',
  'Rabbit',
  'Horse',
  'Sheep',
  'Pig',
  'Hen',
  'Duck',
  'Goose',
  'Peacock',
  'Parrot',
  'Crow',
  'Sparrow',
  'Owl',
  'Eagle',
  'Pigeon',
  'Swan',
  'Crane',
  'Stork',
  'Flamingo',
  'Pelican',
  'Penguin',
  'Seagull',
  'Albatross',
  'Dove',
  'Vulture',
  'Kite',
  'Hawk',
  'Falcon',
  'Ostrich',
  'Emu',
  'Rhea',
  'Cassowary',
  'Kiwi',
  'Pheasant',
  'Quail',
  'Turkey',
  'Peaf',
]

/**
 * Generates a unique referral code by combining a random adjective, noun and 4-digit number
 *
 * @returns {string} A referral code in the format "AdjectiveNounXXXX"
 * where XXXX is a random 4-digit number between 1000-9999
 *
 * @example
 * generateWordReferralCode() // Returns something like "HappyCat1234"
 */
export const generateWordReferralCode = (): string => {
  // Get random adjective from the adjectives array
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)]

  // Get random noun from the nouns array
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]

  // Generate random 4-digit number between 1000-9999
  const randomNumber = Math.floor(1000 + Math.random() * 9000)

  // Combine the parts to create the referral code
  return `${randomAdjective}${randomNoun}${randomNumber}`
}
