/** Bank soal Tingkat 3 Bahasa Inggris (kelas 5–6). */

export interface FillItem { text: string; answer: string; wrongs: [string, string]; emoji: string }

/** Kalimat rumpang ("___"). Tier 1: I/You/We + have/am/are. Tier 2: he/she + kata kerja -s. Tier 3: campuran. */
export const FILL_BANK: Record<1 | 2 | 3, FillItem[]> = {
  1: [
    { text: 'I ___ a red ball.', answer: 'have', wrongs: ['has', 'am'], emoji: '⚽' },
    { text: 'I ___ happy today.', answer: 'am', wrongs: ['is', 'are'], emoji: '😊' },
    { text: 'You ___ my friend.', answer: 'are', wrongs: ['is', 'am'], emoji: '🤝' },
    { text: 'We ___ at school.', answer: 'are', wrongs: ['is', 'am'], emoji: '🏫' },
    { text: 'I ___ two cats.', answer: 'have', wrongs: ['has', 'am'], emoji: '🐱' },
    { text: 'They ___ good friends.', answer: 'are', wrongs: ['is', 'am'], emoji: '👭' },
    { text: 'I ___ a student.', answer: 'am', wrongs: ['is', 'are'], emoji: '🎒' },
    { text: 'You ___ a big dog.', answer: 'have', wrongs: ['has', 'is'], emoji: '🐕' },
  ],
  2: [
    { text: 'She ___ apples.', answer: 'likes', wrongs: ['like', 'liking'], emoji: '🍎' },
    { text: 'He ___ a new bike.', answer: 'has', wrongs: ['have', 'having'], emoji: '🚲' },
    { text: 'The cat ___ milk.', answer: 'drinks', wrongs: ['drink', 'drinking'], emoji: '🥛' },
    { text: 'My mother ___ rice.', answer: 'cooks', wrongs: ['cook', 'cooking'], emoji: '🍚' },
    { text: 'Dika ___ a book.', answer: 'reads', wrongs: ['read', 'reading'], emoji: '📖' },
    { text: 'The dog ___ in the garden.', answer: 'runs', wrongs: ['run', 'running'], emoji: '🐕' },
    { text: 'He ___ his teeth every day.', answer: 'brushes', wrongs: ['brush', 'brushing'], emoji: '🪥' },
    { text: 'She ___ a beautiful song.', answer: 'sings', wrongs: ['sing', 'singing'], emoji: '🎤' },
  ],
  3: [
    { text: 'They ___ football every Sunday.', answer: 'play', wrongs: ['plays', 'playing'], emoji: '⚽' },
    { text: 'The birds ___ in the sky.', answer: 'fly', wrongs: ['flies', 'flying'], emoji: '🐦' },
    { text: 'My brother ___ a teacher.', answer: 'is', wrongs: ['are', 'am'], emoji: '🧑‍🏫' },
    { text: 'We ___ to school by bus.', answer: 'go', wrongs: ['goes', 'going'], emoji: '🚌' },
    { text: 'My sister ___ a cat.', answer: 'has', wrongs: ['have', 'are'], emoji: '🐱' },
    { text: 'The children ___ happy.', answer: 'are', wrongs: ['is', 'am'], emoji: '😄' },
    { text: 'I ___ breakfast at seven.', answer: 'eat', wrongs: ['eats', 'eating'], emoji: '🍳' },
    { text: 'It ___ raining now.', answer: 'is', wrongs: ['are', 'am'], emoji: '🌧️' },
  ],
};

export interface StoryItem { story: string; emoji: string; question: string; answer: string; wrongs: [string, string] }

/** Cerita pendek + satu pertanyaan pemahaman. Level 1–4 = L27–30 (makin panjang dan butuh penyimpulan). */
export const STORY_BANK: Record<1 | 2 | 3 | 4, StoryItem[]> = {
  1: [
    { story: 'Budi has a red kite. He plays with it in the park.', emoji: '🧒🪁🌳', question: 'What does Budi have?', answer: 'A red kite', wrongs: ['A blue ball', 'A green bike'] },
    { story: 'Sinta is hungry. She eats an apple.', emoji: '👧🍎', question: 'What does Sinta eat?', answer: 'An apple', wrongs: ['A banana', 'Rice'] },
    { story: 'It is sunny today. Andi goes to the beach.', emoji: '☀️🏖️', question: 'Where does Andi go?', answer: 'To the beach', wrongs: ['To school', 'To the market'] },
    { story: 'The cat is on the bed. It is sleeping.', emoji: '🐱🛏️💤', question: 'What is the cat doing?', answer: 'Sleeping', wrongs: ['Running', 'Eating'] },
    { story: 'Mira likes blue. Her bag is blue.', emoji: '👜💙', question: "What color is Mira's bag?", answer: 'Blue', wrongs: ['Red', 'Green'] },
  ],
  2: [
    { story: 'Tono wakes up at six. He takes a bath. Then he goes to school.', emoji: '⏰🛁🏫', question: 'What does Tono do after his bath?', answer: 'He goes to school', wrongs: ['He sleeps', 'He eats lunch'] },
    { story: 'Lia has three pencils. Her friend gives her two more. Now she has five.', emoji: '✏️✏️✏️➕✏️✏️', question: 'How many pencils does Lia have now?', answer: 'Five', wrongs: ['Three', 'Two'] },
    { story: 'The farmer has a cow and two goats. He feeds them every morning.', emoji: '👨‍🌾🐮🐐🐐', question: 'How many animals does the farmer have?', answer: 'Three', wrongs: ['Two', 'Four'] },
    { story: 'Dina is sad. She lost her doll. Her mother finds it under the sofa.', emoji: '😢🪆🛋️', question: 'Where is the doll?', answer: 'Under the sofa', wrongs: ['On the bed', 'In the bag'] },
    { story: 'Rafi plays football with his friends. He scores two goals. His team wins.', emoji: '⚽🥅🏆', question: "What happens to Rafi's team?", answer: 'They win', wrongs: ['They lose', 'They go home'] },
  ],
  3: [
    { story: 'Ana and her father go to the market. They buy fish, rice, and vegetables. Ana carries the vegetables. Her father carries the fish and rice.', emoji: '👧👨🛒🐟🥬', question: 'Who carries the vegetables?', answer: 'Ana', wrongs: ['Her father', 'Her mother'] },
    { story: 'Yesterday it rained all day. Bima could not play outside. He stayed at home and drew a picture. In the evening he showed it to his mom.', emoji: '🌧️🏠🎨', question: 'What did Bima do at home?', answer: 'He drew a picture', wrongs: ['He played football', 'He went swimming'] },
    { story: 'Sari has a pet rabbit named Snowy. Snowy is white and likes carrots. Every afternoon Sari gives it two carrots. Snowy eats them quickly.', emoji: '🐰🥕🥕', question: 'What does Snowy like?', answer: 'Carrots', wrongs: ['Fish', 'Bones'] },
    { story: 'The bus leaves at seven o clock. Eko wakes up late. He runs to the bus stop. He is sad because the bus is gone.', emoji: '🚌⏰🏃😢', question: 'Why is Eko sad?', answer: 'He missed the bus', wrongs: ['He lost his bag', 'He is hungry'] },
    { story: 'There is a big tree in front of my house. A bird made a nest in the tree. Now there are three eggs in the nest. I hope they will hatch soon.', emoji: '🌳🪺🥚', question: 'Where are the eggs?', answer: 'In the nest', wrongs: ['On the ground', 'In my house'] },
  ],
  4: [
    { story: 'Tia put on her raincoat and took an umbrella. She looked at the dark sky. Then she walked to school.', emoji: '🧥☂️☁️🏫', question: 'What will the weather be like?', answer: 'It will rain', wrongs: ['It is very hot', 'It is snowy'] },
    { story: 'Dodo opens the fridge and drinks a lot of water. His face is red and he is wet with sweat. He just played football in the sun.', emoji: '🥵💧⚽☀️', question: 'Why does Dodo drink so much water?', answer: 'He is thirsty', wrongs: ['He is cold', 'He is sleepy'] },
    { story: 'Lina saves ten thousand rupiah every week. After four weeks, she buys a storybook for thirty thousand. She keeps the rest in her piggy bank.', emoji: '🐷💰📚', question: 'How much money is left?', answer: 'Ten thousand rupiah', wrongs: ['Thirty thousand rupiah', 'Forty thousand rupiah'] },
    { story: 'The teacher asks, who can help me? Rani raises her hand. She carries the books to the library. The teacher says, thank you Rani, you are very kind.', emoji: '🧑‍🏫🙋‍♀️📚', question: 'What kind of girl is Rani?', answer: 'Helpful', wrongs: ['Lazy', 'Angry'] },
    { story: 'Kiki goes to bed early because tomorrow is her birthday. She dreams about a big cake and many gifts. In the morning she smiles happily.', emoji: '🛏️🎂🎁', question: 'Why does Kiki go to bed early?', answer: 'Tomorrow is her birthday', wrongs: ['She is sick', 'She is angry'] },
  ],
};
