'use client';

import { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import ProductForm from '@/components/ProductForm';
import ProductTable from '@/components/ProductTable';
import { authorizedFetch } from '@/lib/http';
import { useRouter } from 'next/navigation';

const ProductsPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [error, setError] = useState('');

  const ensureAuth = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.replace('/login');
      return false;
    }
    return true;
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [categoriesData, productsData] = await Promise.all([
        authorizedFetch('/categories'),
        authorizedFetch('/products'),
      ]);
      setCategories(categoriesData);
      setProducts(productsData);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ensureAuth()) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateProduct = async (payload) => {
    setCreateLoading(true);
    setError('');
    try {
      await authorizedFetch('/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      await loadData();
    } catch (err) {
      setError(err.message || 'Unable to create product');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleUpdateProduct = async (payload) => {
    if (!editProduct) return;
    setUpdateLoading(true);
    setError('');
    try {
      await authorizedFetch(`/products/${editProduct.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      setEditProduct(null);
      await loadData();
    } catch (err) {
      setError(err.message || 'Unable to update product');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    setDeletingId(productId);
    setError('');
    try {
      await authorizedFetch(`/products/${productId}`, {
        method: 'DELETE',
      });
      await loadData();
    } catch (err) {
      setError(err.message || 'Unable to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#f5f5f5] flex flex-col">
      <NavBar />
      <main className="flex-1 space-y-6 px-4 py-6 md:px-10 md:py-10">
          <header className="space-y-2">
            <p className="text-xs uppercase tracking-[0.5em] text-[#6f6f6f]">
              Products
            </p>
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <h1 className="text-3xl font-semibold">Inventory</h1>
              <p className="text-sm text-[#b0b0b0]">
                Add, update, and remove inventory items instantly.
              </p>
            </div>
          </header>

          {error && (
            <div className="rounded-md border border-[#3d1c1c] bg-[#170c0c] px-4 py-3 text-sm text-[#fdaaaa]">
              {error}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
            <div className="space-y-6">
              <ProductForm
                categories={categories}
                loading={createLoading}
                onSubmit={handleCreateProduct}
              />

              {editProduct && (
                <ProductForm
                  categories={categories}
                  initialData={editProduct}
                  loading={updateLoading}
                  onSubmit={handleUpdateProduct}
                  onCancel={() => setEditProduct(null)}
                />
              )}
            </div>

            <section className="space-y-4">
              {loading ? (
                <div className="rounded-lg border border-[#262626] bg-[#111111] p-10 text-center text-[#b0b0b0]">
                  Loading products...
                </div>
              ) : (
                <ProductTable
                  products={products}
                  categories={categories}
                  onEdit={setEditProduct}
                  onDelete={handleDeleteProduct}
                  deletingId={deletingId}
                />
              )}
            </section>
          </div>
      </main>
    </div>
  );
};

export default ProductsPage;