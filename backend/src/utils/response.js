function ok(res, data) {
	return res.status(200).json(data);
}

function created(res, data) {
	return res.status(201).json(data);
}

function badRequest(res, message) {
	return res.status(400).json({ message });
}

function unauthorized(res, message = 'Unauthorized') {
	return res.status(401).json({ message });
}

function forbidden(res, message = 'Forbidden') {
	return res.status(403).json({ message });
}

function serverError(res, message = 'Server error') {
	return res.status(500).json({ message });
}

module.exports = { ok, created, badRequest, unauthorized, forbidden, serverError };


