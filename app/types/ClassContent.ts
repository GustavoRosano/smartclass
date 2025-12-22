export type ClassContent = {
  id: string;
  classNumber: string;
  teacher: string;
  title: string;
  image: string;
  content: {
    type: "title" | "subtitle" | "text" | "link";
    value: string;
  }[];
};