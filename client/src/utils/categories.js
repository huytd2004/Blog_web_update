const capitalizeFirstLetter = (str) => {
  const capitalWord = str.charAt(0).toUpperCase() + str.slice(1);
  return capitalWord;
};

const categories = [
  "all",
  "programming",
  "web development",
  "mobile development",
  "data science",
  "artificial intelligence",
  "cybersecurity",
  "cloud computing",
  "software engineering",
  "devops",
  "database",
  "ui/ux design",
  "networking",
  "blockchain",
  "game development",
  "IT career",
  "others",
];

export { categories, capitalizeFirstLetter };
