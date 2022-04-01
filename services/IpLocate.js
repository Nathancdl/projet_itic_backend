import axios from "axios";

export default async function (ip) {
  try {
    const response = (await axios.get(`https://ipapi.co/${ip}/json/`)).data
    if (!response.error) {
      return response
    }
  } catch (e) {
    console.error(e)
  }
}
