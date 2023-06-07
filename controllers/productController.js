const db = require('../models/index');
const { Product, Categorys, Classifys, Images } = db;
const Sequelize = require('sequelize');

const ProductController = {
	// Thêm sản phẩm
	createProduct: async (req, res) => {
		const { name, price, quantity, describe, categorys, classifys } = req.body;
		const images = req.file ? req.file.filename : null;
		try {
			const product = await Product.create({
				name,
				price,
				quantity,
				describe,
				images,
				categorys,
				classifys,
			});
			res.redirect('/admin/list_product');
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	},
	// Update sản phẩm
	getUpdateProduct: async (req, res) => {
		const { id } = req.params;
		try {
			// Dùng phương thức Product.findByPk để tìm 'id' tương ứng
			const product = await Product.findByPk(id);
			if (!product) {
				res.status(404).json({ message: 'Product not found' });
				return;
			}
			console.log(product);
			// res.status(200).json(product);
			res.render('admin/update-product', { product });
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	},
	// Sửa sản phẩm
	updateProduct: async (req, res) => {
		const { id } = req.params;
		const { name, price, quantity, describe } = req.body;

		try {
			const product = await Product.findByPk(id);
			const images = req.file ? req.file.filename : product.images;
			const updated = await Product.update(
				// Cập nhật các trường thông tin sản phẩm và thời gian cập nhật
				{
					name,
					price,
					quantity,
					describe,
					images,
					// updatedAt: new Date(),
				},
				{ where: { id } }
			);
			if (updated === 0) {
				// Nếu không tìm thấy sản phẩm thì trả về lỗi 404
				res.status(404).json({ message: 'Product not found' });
				return;
			}
			// const product = await Product.findByPk(id);
			// Trả về thông báo khi sản phẩm được cập nhật thành công
			// res.json({ message: 'Sửa sản phẩm thành công!' });
			res.redirect('/admin/list_product');
		} catch (error) {
			// Nếu có lỗi trong quá trình cập nhật sản phẩm thì trả về lỗi 500
			console.log(error);
			res.status(500).send('Internal Server Error');
		}
	},
	// Xoá sản phẩm
	deleteProduct: async (req, res) => {
		const { id } = req.params;
		try {
			const deletedRows = await Product.destroy({
				where: { id },
			});
			if (deletedRows === 0) {
				res.status(404).json({ message: 'Không tìm thấy sản phẩm!' });
				return;
			}
			res.redirect('/admin/list_product');
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	},
	// Lấy tất cả sản phẩm
	getAllProduct: async (req, res) => {
		try {
			const products = await Product.findAll({
				order: [['id', 'ASC']],
				limit: 8,
			});
			res.status(200).json(products);
		} catch (error) {
			console.log(error);
			res.status(500).send('Internal Server Error');
		}
	},
	getNewProduct: async (req, res) => {
		try {
			const products = await Product.findAll({
				order: [['id', 'DESC']],
				limit: 4,
			});
			res.status(200).json(products);
		} catch (error) {
			console.log(error);
			res.status(500).send('Internal Server Error');
		}
	},
	getAlbum: async (req, res) => {
		try {
			const products = await Product.findAll({
				where: {
					id_categorys: 1,
				},
				limit: 16,
			});
			res.status(200).json(products);
		} catch (error) {
			console.log(error);
			res.status(500).send('Internal Server Error');
		}
	},
	getLightstick: async (req, res) => {
		try {
			const products = await Product.findAll({
				where: {
					id_categorys: 2,
				},
				limit: 16,
			});
			res.status(200).json(products);
		} catch (error) {
			console.log(error);
			res.status(500).send('Internal Server Error');
		}
	},
	// quản lý sản phẩm
	getAdminProduct: async (req, res) => {
		try {
			const products = await Product.findAll();
			res.status(200).json(products);
		} catch (error) {
			console.log(error);
			res.status(500).send('Internal Server Error');
		}
	},
	// Lấy thông tin Product theo ID
	getProductById: async (req, res) => {
		const { id } = req.params;
		try {
			// Dùng phương thức Product.findByPk để tìm 'id' tương ứng
			const product = await Product.findByPk(id);
			if (!product) {
				res.status(404).json({ message: 'Product not found' });
				return;
			}
			// res.status(200).json(product);
			res.render('product', { product });
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: 'Internal Server Error' });
		}
	},
	// Lấy danh sách sản phẩm theo danh mục con
	// getProdByCateChildId: async (req, res) => {
	//   const { catechildid } = req.query;
	//   try {
	//     // Tìm danh sách sản phẩm có idCate tương ứng với idCate được truyền vào
	//     const products = await Product.findAll({
	//       where: {
	//         cate_child_prod: catechildid,
	//       },
	//     });
	//     if (products.length === 0) {
	//       res.status(404).json({ message: 'Không tìm thấy sản phẩm ở danh mục này!' });
	//       return;
	//     }
	//     res.status(200).json(products);
	//   } catch (error) {
	//     console.log(error);
	//     res.status(500).json({ message: 'Internal Server Error' });
	//   }
	// },
	// Lấy danh sách sản phẩm theo danh mục mẹ
	// getProdByCateId: async (req, res) => {
	//   const { cateid } = req.query;
	//   try {
	//     const products = await Product.findAll({
	//       include: [
	//         {
	//           model: CategoryChild,
	//           attributes: ['id_category_child', 'name_category_child'],
	//           include: [
	//             {
	//               model: Category,
	//               // attributes: ['id_category', 'name_category'],
	//               where: {
	//                 id_category: cateid,
	//               },
	//             },
	//           ],
	//         },
	//       ],
	//     });
	//     if (products.length === 0) {
	//       res.status(404).json({ message: 'Không tìm thấy sản phẩm ở danh mục này!' });
	//       return;
	//     }
	//     res.status(200).json(products);
	//   } catch (error) {
	//     console.log(error);
	//     res.status(500).json({ message: 'Internal Server Error' });
	//   }
	// },
};

module.exports = ProductController;
