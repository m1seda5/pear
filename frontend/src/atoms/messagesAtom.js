import { atom } from "recoil";

export const conversationsAtom = atom({
  key: 'conversationsAtom',
  default: [], // Ensure default is an empty array
});

export const selectedConversationAtom = atom({
  key: "selectedConversationAtom",
  default: {
    _id: "",
    userId: "",
    username: "",
    userProfilePic: "",
  },
});