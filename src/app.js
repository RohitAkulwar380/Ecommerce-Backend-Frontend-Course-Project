const express = require ('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fs = require('fs');
const {applySecurity} = require ('./middleware/security');
const {errorHandler} = require ('./middleware/error');
const cookieParser = require('cookie-parser');
require('./utils/upload-init'); // Initialize upload directories


const authRoutes = require ('./routes/auth.routes');
const cartRoutes = require ('./routes/cart.routes');
const orderRoutes = require ('./routes/order.routes');
const categoryRoutes = require ('./routes/category.routes');
const productRoutes = require ('./routes/product.routes');
const userRoutes = require ('./routes/user.routes');
const profileRoutes = require('./routes/profile.routes');

const app = express();

app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET || ''));

// Serve static files with absolute path
const path = require('path');
const uploadsPath = path.resolve(process.cwd(), 'public/uploads');
console.log('Serving static files from:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));

// Debug route to list uploads directory
app.get('/api/debug/uploads', async (req, res) => {
    const uploadsDir = path.resolve(process.cwd(), 'public/uploads/avatars');
    try {
        await fs.promises.access(uploadsDir);
        const files = await fs.promises.readdir(uploadsDir);
        const fileDetails = await Promise.all(
            files.map(async (file) => {
                const stats = await fs.promises.stat(path.join(uploadsDir, file));
                return {
                    name: file,
                    size: stats.size,
                    created: stats.birthtime
                };
            })
        );
        res.json({
            currentDir: process.cwd(),
            uploadsPath: uploadsDir,
            files: fileDetails
        });
    } catch (error) {
        res.json({
            error: error.message,
            currentDir: process.cwd(),
            uploadsPath: uploadsDir
        });
    }
});

if (process.env.NODE_ENV === 'test'){
    app.use(morgan('dev'));
}

applySecurity(app);

app.get('/api/health', (req, res) => {
    res.json({success: true, message: 'OK'});
})

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin/users', userRoutes);
app.use('/api/profile', profileRoutes);


app.use((req, res) => {
    res.status(404).json({success: false, message: 'Not found'});
})

app.use(errorHandler);

module.exports = app;