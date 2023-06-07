const db = require('../models/index');
const { User, Role } = db;
const jwt = require('jsonwebtoken');
//
const mailApp = require('../mail/mailApp');
//
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

// .ENV
require('dotenv').config();
// Sử dụng biến môi trường JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = {
	// Auth Login
	authLogin: async (req, res) => {
		const { email, password } = req.body;
		// Tìm kiếm người dùng trong cơ sở dữ liệu
		const user = await User.findOne({
			where: {
				email: email,
			},
			include: {
				model: Role,
				attributes: ['namerole', 'shortrole'],
			},
		});
		// Kiểm tra tính hợp lệ của tên đăng nhập và mật khẩu
		if (!user) {
			return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không hợp lệ!' });
		}
		// So sánh mật khẩu
		const passwordMatches = await bcryptjs.compare(password, user.password);
		if (!passwordMatches) {
			return res.status(401).json({ message: 'Mật khẩu không hợp lệ!' });
		}
		// Tạo mã thông báo (token) để xác thực yêu cầu của người dùng
		const token = jwt.sign({ userId: user.id, email: user.email, role: user.Role.shortrole }, JWT_SECRET);
		// Lưu trữ token trong cơ sở dữ liệu
		user.token = token;
		await user.save();
		// Trả về cookie token cho trang đăng nhập
		// Kiểm tra role tài khoản
		if (user.Role.shortrole == 'admin') {
			const redirectUrl = 'http://localhost:3000/admin';
			return res
				.cookie('access_token', token, { httpOnly: true })
				.json({ message: 'Đăng nhập thành công!', redirectUrl: redirectUrl });
		} else {
			const redirectUrl = 'http://localhost:3000/';
			return res
				.cookie('access_token', token, { httpOnly: true })
				.json({ message: 'Đăng nhập thành công!', redirectUrl: redirectUrl });
		}
	},
	// Sign Up - Đăng ký
	signUp: async (req, res) => {
		const { name, email, password } = req.body;
		try {
			// Kiểm tra userName tồn tại chưa
			const existingUser = await User.findOne({ where: { email: email } });
			if (existingUser) {
				res.status(400).json({ message: 'Tài khoản đã tồn tại' });
			} else {
				// Mã hoá mật khẩu
				const salt = await bcryptjs.genSalt(saltRounds);
				const hashedPassword = await bcryptjs.hash(password, salt);
				// Upload data
				const user = await User.create({ name, email, password: hashedPassword });
				// Gửi mail khi tạo tài khoản thành công
				mailApp.createAccount(name, email);
				// End mail
				res
					.status(201)
					.json({ message: 'Tạo tài khoản thành công!', redirectUrl: 'http://localhost:3000/signin' });
			}
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: 'Internal Server Error!' });
		}
	},
	// Admin
	adminRole: async (req, res, next) => {
		// Lấy token từ header của yêu cầu
		const token = req.cookies.access_token;
		if (!token) {
			return res.status(401).json({ message: 'Không tìm thấy token xác thực!' });
		}
		try {
			const decoded = jwt.verify(token, JWT_SECRET);
			if (decoded.role == 'admin') {
				next();
			} else {
				return res.status(401).json({ message: 'Bạn không có quyền truy cập!' });
			}
		} catch (error) {
			return res.status(403).json({ message: 'Lỗi xác thực token!' });
		}
	},
	// Cộng tác viên
	ctvRole: async (req, res, next) => {
		// Lấy token từ header của yêu cầu
		const token = req.cookies.access_token;
		if (!token) {
			return res.status(401).json({ message: 'Không tìm thấy token xác thực!' });
		}
		try {
			const decoded = jwt.verify(token, JWT_SECRET);
			console.log(decoded.role);
			if (decoded.role == 'ctv') {
				next();
			} else {
				return res.status(401).json({ message: 'Bạn không có quyền truy cập!' });
			}
		} catch (error) {
			return res.status(403).json({ message: 'Lỗi xác thực token!' });
		}
	},

	// Đăng xuất
	authLogout: async (req, res, next) => {
		// Lấy token từ header của yêu cầu
		const token = req.cookies.access_token;
		if (!token) {
			return res.status(401).json({ message: 'Không tìm thấy token xác thực!' });
		}
		try {
			// Giải mã token để lấy ra định danh của người dùng
			const decoded = jwt.verify(token, JWT_SECRET);
			// Tìm kiếm người dùng trong cơ sở dữ liệu để kiểm tra tính hợp lệ của token
			const user = await User.findByPk(decoded.userId);
			if (!user) {
				// Nếu không tìm thấy người dùng, trả về lỗi 401
				return res.status(401).json({ message: 'Không tìm thấy tài khoản!' });
			}
			// Thực hiện xoá token người dùng ở server
			// Set token null
			user.token = null;
			await user.save();
			res
				// Xoá cookie
				.clearCookie('access_token', { sameSite: 'none', secure: true })
				.json({ message: 'Đăng xuất thành công!' });
		} catch (err) {
			// Nếu giải mã token bị lỗi, trả về lỗi 403
			return res.status(403).json({ message: 'Forbidden' });
		}
	},
};

module.exports = authenticateToken;
