
import search from './../controllers/search'

const searchRoutes = router => {
	router.get('/all', search.searchAll)
	return router;
}

export default searchRoutes;