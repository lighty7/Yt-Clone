const nodemailer = require('nodemailer');
const env = require('../config/env');

let transporter;

function getTransporter() {
	if (transporter) return transporter;

	if (env.smtp.host && env.smtp.user && env.smtp.pass) {
		transporter = nodemailer.createTransport({
			host: env.smtp.host,
			port: env.smtp.port,
			secure: env.smtp.secure,
			auth: {
				user: env.smtp.user,
				pass: env.smtp.pass,
			},
		});
	} else {
		transporter = nodemailer.createTransport({
			sendmail: true,
			newline: 'unix',
			path: '/usr/sbin/sendmail',
		});
		console.warn('⚠️ SMTP env not set. Falling back to system sendmail.');
	}
	return transporter;
}

async function sendMail({ to, subject, html, text }) {
	const from = env.smtp.from;
	const tx = getTransporter();
	return tx.sendMail({ from, to, subject, html, text });
}

module.exports = { sendMail };


