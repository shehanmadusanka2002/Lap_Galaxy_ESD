import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const containerRefs = useRef({});

  useEffect(() => {
    axios.get('http://localhost:8080/api/product/products')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Error fetching products:', err));
  }, []);

  const categories = [...new Set(products.map(p => p.category))];

  const scroll = (category, direction) => {
    const container = containerRefs.current[category];
    if (container) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold text-center mb-12 text-gray-800 dark:text-white">
        🛍️ Browse Products by Category
      </h1>

      {categories.map((category) => {
        const categoryProducts = products.filter(p => p.category === category);

        return (
          <div key={category} className="mb-16">
            <h2 className="text-2xl text-center font-semibold text-gray-700 dark:text-white mb-6">
              {category}
            </h2>
            <div className="relative">
              {/* Scroll Left Button */}
              <button
                onClick={() => scroll(category, 'left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-white dark:bg-gray-800 shadow-md rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <ArrowLeft size={20} />
              </button>

              {/* Scrollable Products Row */}
              <div
                ref={(el) => (containerRefs.current[category] = el)}
                className="flex gap-6 overflow-x-auto px-10 py-4 scroll-smooth scrollbar-hide"
              >
                {categoryProducts.map((product) => (
                  <div
                    key={product.id}
                    className="min-w-[260px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105"
                  >
                    <img
                      src={`data:${product.imageType};base64,${product.imageBase64}`}
                      alt={product.name}
                      className="w-full h-52 object-cover rounded-t-2xl"
                    />
                    <div className="p-4 space-y-2">
                      <h3 className="text-lg font-bold text-center text-gray-800 dark:text-white truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 text-center dark:text-gray-400">{product.brand}</p>
                      <div className="flex justify-between items-center pt-2">
                        <span className={`text-sm font-semibold ${product.productAvailable === 'In Stock' ? 'text-green-600' : 'text-red-500'}`}>
                          {product.productAvailable}
                        </span>
                        <span className="text-lg font-bold text-amber-500">
                          Rs. {product.price}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => navigate(`/product/${product.id}`)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-sm transition"
                        >
                          View
                        </button>
                        <button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-xl text-sm transition">
                          Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Scroll Right Button */}
              <button
                onClick={() => scroll(category, 'right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 bg-white dark:bg-gray-800 shadow-md rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default ProductList;
