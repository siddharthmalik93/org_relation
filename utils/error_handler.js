const wrap = (handlerFn) => async (req, res, next) => {
	try {
		return await handlerFn(req, res, next);
	} catch (e) {
		handle_error(req, res, e);
	}
};

const handle_error = (_req, res, err, _next) => {
	if (err.statusCode) {
		res.status(err.statusCode);
	} else {
		res.status(500);
	}

	return res.json({
		success: false,
		error: err.name,
		message: err.message,
		status: 0,
		details: err.details,
	});
};

module.exports = {
	wrap,
};
