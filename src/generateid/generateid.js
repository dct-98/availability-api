function generateid() {
    const randomWords = [
        "Mountain", "Galaxy", "Dinosaur", "Quasar", "Keyboard",
        "Journey", "Victory", "Umbrella", "Forest", "Lemonade",
        "Television", "Ornament", "Happiness", "Question", "Trampoline",
        "Elegance", "Wisdom", "Champion", "Boulevard", "Zipper",
        "Pinnacle", "Strawberry", "Friendship", "Lighthouse", "Kangaroo"
      ]
      const length = 3
      let id = ''

      for (let i = 0; i < length; i++) {
        id += randomWords[Math.floor(Math.random() * randomWords.length)]
      }

      return id;
}

module.exports = {
    generateid
}