export type Theme = 'classique' | 'anime' | 'pop-culture' | 'musique';

export interface WordPair {
  civilWord: string;
  impostorWord: string;
}

export const WORD_PAIRS: Record<Theme, WordPair[]> = {
  classique: [
    { civilWord: 'Plage', impostorWord: 'Piscine' },
    { civilWord: 'Avocat', impostorWord: 'Citron' },
    { civilWord: 'Piano', impostorWord: 'Guitare' },
    { civilWord: 'Loup', impostorWord: 'Renard' },
    { civilWord: 'Chocolat', impostorWord: 'Caramel' },
    { civilWord: 'Montagne', impostorWord: 'Colline' },
    { civilWord: 'Médecin', impostorWord: 'Infirmier' },
    { civilWord: 'Château', impostorWord: 'Manoir' },
    { civilWord: 'Sushi', impostorWord: 'Maki' },
    { civilWord: 'Football', impostorWord: 'Rugby' },
  ],
  anime: [
    { civilWord: 'Naruto', impostorWord: 'Sasuke' },
    { civilWord: 'Goku', impostorWord: 'Vegeta' },
    { civilWord: 'One Piece', impostorWord: 'Fairy Tail' },
    { civilWord: 'Totoro', impostorWord: 'Catbus' },
    { civilWord: 'Pikachu', impostorWord: 'Rondoudou' },
    { civilWord: 'Demon Slayer', impostorWord: 'Jujutsu Kaisen' },
    { civilWord: 'Fullmetal Alchemist', impostorWord: 'Soul Eater' },
    { civilWord: 'Eren Yeager', impostorWord: 'Levi Ackerman' },
  ],
  'pop-culture': [
    { civilWord: 'Harry Potter', impostorWord: 'Le Seigneur des Anneaux' },
    { civilWord: 'Batman', impostorWord: 'Spider-Man' },
    { civilWord: 'Netflix', impostorWord: 'Disney+' },
    { civilWord: 'iPhone', impostorWord: 'Samsung' },
    { civilWord: 'Fortnite', impostorWord: 'Minecraft' },
    { civilWord: 'TikTok', impostorWord: 'Instagram' },
    { civilWord: 'Star Wars', impostorWord: 'Star Trek' },
    { civilWord: 'The Witcher', impostorWord: 'Game of Thrones' },
  ],
  musique: [
    { civilWord: 'Stromae', impostorWord: 'Nekfeu' },
    { civilWord: 'Taylor Swift', impostorWord: 'Billie Eilish' },
    { civilWord: 'Jazz', impostorWord: 'Blues' },
    { civilWord: 'Rap', impostorWord: 'R&B' },
    { civilWord: 'Vinyle', impostorWord: 'CD' },
    { civilWord: 'Spotify', impostorWord: 'Deezer' },
    { civilWord: 'Coachella', impostorWord: 'Glastonbury' },
    { civilWord: 'Microphone', impostorWord: 'Haut-parleur' },
  ],
};

export const THEMES: { id: Theme; label: string }[] = [
  { id: 'classique', label: 'Classique' },
  { id: 'anime', label: 'Anime' },
  { id: 'pop-culture', label: 'Pop Culture' },
  { id: 'musique', label: 'Musique' },
];
