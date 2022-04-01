import Film from "./../services/Film"


const SEARCH_COUNT = "film_searchCount"

async function searchAll(req, res) {
  await DB.Shield.check(req.clientIp, DB.Shield.FILM_SEARCH);
  const { params, headers } = await getAndVerifyParams(req);
  let film = new Film()
  console.log(params, headers)
  let result = await bing.Search(params, headers)
  setCountryCodeCookie(req, res, result)
  await incrementSearchCount(req, res).catch(e => {
    //An error has occured : do nothing
  })
  await DB.Shield.save(req.clientIp, DB.Shield.BING_SEARCH);
  res.status(200).json(result.data);
}




export default {
  searchAll
};
