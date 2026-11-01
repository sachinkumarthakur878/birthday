export type BirthdayTheme = "midnight" | "romantic" | "pastel";

export type BirthdayConfig = {
  recipientName: string;
  recipientPhoto: string;
  message: string;
  senderName?: string;
  additionalPhotos?: string[];
  theme?: BirthdayTheme;
  musicUrl?: string;
  birthdayDate?: string;
};

// Personalize the experience here. Put your photo in public/images and update
// recipientPhoto to its path, for example: "/images/riya.jpg".
export const birthdayConfig: BirthdayConfig = {
  recipientName: "Shikha",
  recipientPhoto: "/images/shikha.jpeg",
  message:
    "Happy Birthday, Shikha! Tu sirf meri best friend nahi, meri life ki woh apni si insaan hai jiske saath har baat thodi aur achhi lagti hai. Teri hasi hamesha aise hi chamakti rahe, tere saare sapne poore hon, aur is naye saal mein tujhe dher saara pyaar, sukoon aur khushiyan milen. Mere har crazy moment ka hissa banne aur hamesha saath dene ke liye thank you. Bahut lucky hoon ki tu meri best friend hai. Love you, yaar!",
  senderName: "Sachin",
  theme: "midnight",
  birthdayDate: "05 November 2026",
  additionalPhotos: [],
};
