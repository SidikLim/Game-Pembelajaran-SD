export interface VocabItem { id: string; word: string; emoji?: string; color?: string; count?: number }

export const LETTER_WORDS: Record<string, { word: string; emoji: string }> = {
  A: { word: 'Apple', emoji: '🍎' }, B: { word: 'Ball', emoji: '⚽' }, C: { word: 'Cat', emoji: '🐱' },
  D: { word: 'Dog', emoji: '🐶' }, E: { word: 'Egg', emoji: '🥚' }, F: { word: 'Fish', emoji: '🐟' },
  G: { word: 'Goat', emoji: '🐐' }, H: { word: 'Hat', emoji: '🎩' }, I: { word: 'Ice cream', emoji: '🍦' },
  J: { word: 'Juice', emoji: '🧃' }, K: { word: 'Kite', emoji: '🪁' }, L: { word: 'Lion', emoji: '🦁' },
  M: { word: 'Moon', emoji: '🌙' }, N: { word: 'Nest', emoji: '🪺' }, O: { word: 'Orange', emoji: '🍊' },
  P: { word: 'Pig', emoji: '🐷' }, Q: { word: 'Queen', emoji: '👑' }, R: { word: 'Rabbit', emoji: '🐰' },
  S: { word: 'Sun', emoji: '☀️' }, T: { word: 'Tree', emoji: '🌳' }, U: { word: 'Umbrella', emoji: '☂️' },
  V: { word: 'Van', emoji: '🚐' }, W: { word: 'Whale', emoji: '🐳' }, X: { word: 'Xylophone', emoji: '🎹' },
  Y: { word: 'Yo-yo', emoji: '🪀' }, Z: { word: 'Zebra', emoji: '🦓' },
};
export const LETTERS = Object.keys(LETTER_WORDS);

export const ANIMALS: VocabItem[] = [
  { id: 'cat', word: 'Cat', emoji: '🐱' }, { id: 'dog', word: 'Dog', emoji: '🐶' }, { id: 'cow', word: 'Cow', emoji: '🐮' },
  { id: 'pig', word: 'Pig', emoji: '🐷' }, { id: 'duck', word: 'Duck', emoji: '🦆' }, { id: 'fish', word: 'Fish', emoji: '🐟' },
  { id: 'bird', word: 'Bird', emoji: '🐦' }, { id: 'frog', word: 'Frog', emoji: '🐸' }, { id: 'lion', word: 'Lion', emoji: '🦁' },
  { id: 'horse', word: 'Horse', emoji: '🐴' },
];

export const COLORS: VocabItem[] = [
  { id: 'red', word: 'Red', color: '#E53935' }, { id: 'blue', word: 'Blue', color: '#1E88E5' },
  { id: 'green', word: 'Green', color: '#43A047' }, { id: 'yellow', word: 'Yellow', color: '#FDD835' },
  { id: 'orange', word: 'Orange', color: '#FB8C00' }, { id: 'purple', word: 'Purple', color: '#8E24AA' },
  { id: 'pink', word: 'Pink', color: '#F48FB1' }, { id: 'black', word: 'Black', color: '#212121' },
];

const NUM_WORDS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
export const NUMBERS: VocabItem[] = NUM_WORDS.map((word, i) => ({ id: `n${i + 1}`, word, emoji: '⭐', count: i + 1 }));

export const FRUITS: VocabItem[] = [
  { id: 'apple', word: 'Apple', emoji: '🍎' }, { id: 'banana', word: 'Banana', emoji: '🍌' }, { id: 'grape', word: 'Grapes', emoji: '🍇' },
  { id: 'strawberry', word: 'Strawberry', emoji: '🍓' }, { id: 'orange', word: 'Orange', emoji: '🍊' },
  { id: 'watermelon', word: 'Watermelon', emoji: '🍉' }, { id: 'pineapple', word: 'Pineapple', emoji: '🍍' }, { id: 'pear', word: 'Pear', emoji: '🍐' },
];

export const FAMILY: VocabItem[] = [
  { id: 'mother', word: 'Mother', emoji: '👩' }, { id: 'father', word: 'Father', emoji: '👨' }, { id: 'brother', word: 'Brother', emoji: '👦' },
  { id: 'sister', word: 'Sister', emoji: '👧' }, { id: 'grandmother', word: 'Grandmother', emoji: '👵' },
  { id: 'grandfather', word: 'Grandfather', emoji: '👴' }, { id: 'baby', word: 'Baby', emoji: '👶' },
];

export const BODY: VocabItem[] = [
  { id: 'eye', word: 'Eye', emoji: '👁️' }, { id: 'ear', word: 'Ear', emoji: '👂' }, { id: 'nose', word: 'Nose', emoji: '👃' },
  { id: 'mouth', word: 'Mouth', emoji: '👄' }, { id: 'hand', word: 'Hand', emoji: '✋' }, { id: 'foot', word: 'Foot', emoji: '🦶' },
  { id: 'leg', word: 'Leg', emoji: '🦵' }, { id: 'tooth', word: 'Tooth', emoji: '🦷' }, { id: 'arm', word: 'Arm', emoji: '💪' },
];

/** Kalimat pendek untuk Listening Comprehension; tiap kalimat punya satu gambar unik. */
export const SENTENCES: VocabItem[] = [
  { id: 's1', word: 'I see a red apple', emoji: '🍎' }, { id: 's2', word: 'The dog is running', emoji: '🐕' },
  { id: 's3', word: 'The sun is hot', emoji: '☀️' }, { id: 's4', word: 'It is raining', emoji: '🌧️' },
  { id: 's5', word: 'The bird can fly', emoji: '🐦' }, { id: 's6', word: 'I like to read books', emoji: '📚' },
  { id: 's7', word: 'She is eating pizza', emoji: '🍕' }, { id: 's8', word: 'The baby is sleeping', emoji: '👶' },
  { id: 's9', word: 'We play football', emoji: '⚽' }, { id: 's10', word: 'The fish can swim', emoji: '🐟' },
  { id: 's11', word: 'He rides a bike', emoji: '🚲' }, { id: 's12', word: 'I brush my teeth', emoji: '🪥' },
];

export type PoolName = 'letters' | 'animals' | 'colors' | 'animalsColors' | 'numbers' | 'numbersFruits' | 'family' | 'body' | 'familyBody' | 'sentences';
