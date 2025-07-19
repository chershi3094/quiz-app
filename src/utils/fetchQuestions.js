import axios from "axios";

const fetchQuestions = async (amount = 20, category = "", difficulty = "") => {
  try {
    const url = `https://opentdb.com/api.php?amount=${amount}&type=multiple`;

    const { data } = await axios.get(url);
    return data.results;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};

export default fetchQuestions;
