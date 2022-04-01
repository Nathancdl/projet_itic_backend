
import subscriber from './../controllers/subscriber'

const subscriberRoutes = router => {
	router.post('/', subscriber.add)
	return router;
}

export default subscriberRoutes;