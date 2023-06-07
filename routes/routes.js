const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const productController = require('../controllers/productController');
const cateController = require('../controllers/cateController');
const classifyController = require('../controllers/classifysCTL');
const mailController = require('../mail/mailApp');

const authToken = require('../middleware/authenticateToken');
// Áp dụng middleware để xác thực tính hợp lệ của token cho tất cả các tài nguyên bảo vệ
// router.use(authToken);

let multer = require('multer');
//khai báo sử dụng multer
// SET STORAGE
let storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/images');
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname);
	},
});
let upload = multer({ storage: storage }).single('productImage');

// Links
router.get('/', (req, res) => {
	res.render('index');
});
router.get('/album', (req, res) => {
	res.render('album');
});
router.get('/lightstick', (req, res) => {
	res.render('lightstick');
});
router.get('/cart', (req, res) => {
	res.render('cart');
});
// Admin
router.get('/signin', (req, res) => {
	res.render('admin/signin');
});
router.get('/signup', (req, res) => {
	res.render('admin/signup');
});
router.get('/admin', authToken.adminRole, (req, res) => {
	res.render('admin/admin');
});
// route quản lý sản phẩm
router.get('/admin/list_product', (req, res) => {
	res.render('admin/list-product');
});
router.get('/admin/add_product', (req, res) => {
	res.render('admin/add-product');
});
// route quản lý danh mục
router.get('/admin/list_cate', (req, res) => {
	res.render('admin/list-cate');
});
router.get('/admin/add_cate', (req, res) => {
	res.render('admin/add-cate');
});
// route quản lý phân loại
router.get('/admin/list_classifys', (req, res) => {
	res.render('admin/list-classifys');
});
router.get('/admin/add_classifys', (req, res) => {
	res.render('admin/add-classifys');
});
// route quản lý tài khoản
router.get('/admin/list_acc', (req, res) => {
	res.render('admin/list-acc');
});
// route thống kê
router.get('/admin/chart', (req, res) => {
	res.render('admin/chart');
});
// API sản phẩm
router.get('/admin/:id', productController.getUpdateProduct);
router.post('/admin/:id', upload, productController.updateProduct);
router.get('/product/del/:id', productController.deleteProduct);
router.get('/api/products', productController.getAllProduct);
router.get('/api/productAsc', productController.getNewProduct);
router.get('/api/album', productController.getAlbum);
router.get('/api/lightstick', productController.getLightstick);
// API Account
router.post('/api/createuser', authToken.signUp);
router.post('/api/login', authToken.authLogin);
router.post('/api/logout', authToken.authLogout);
// API Admin
router.post('/admin/add_product', upload, productController.createProduct);
router.get('/products/:id', productController.getProductById);
router.get('/api/list_products', productController.getAdminProduct);
router.get('/api/list_cate', cateController.getAllCate);
router.get('/api/list_classifys', classifyController.getAllClassifys);
router.get('/api/list_acc', userController.getAllUsers);

// Test mail
router.get('/mail', mailController.createAccount);

module.exports = router;
