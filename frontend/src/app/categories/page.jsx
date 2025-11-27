'use client';

import { useEffect, useMemo, useState } from 'react';
import CategoryForm from '@/components/CategoryForm';
import CategoryTable from '@/components/CategoryTable';
import NavBar from '@/components/NavBar';
import { authorizedFetch } from '@/lib/http';
import { useRouter } from 'next/navigation';

const CategoriesPage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
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
      const [categoryPayload, productPayload] = await Promise.all([
        authorizedFetch('/categories'),
        authorizedFetch('/products'),
      ]);
      setCategories(categoryPayload);
      setProducts(productPayload);
    } catch (err) {
      setError(err.message || 'Failed to load categories');
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

  const handleCreateCategory = async (payload) => {
    setFormLoading(true);
    setError('');
    try {
      await authorizedFetch('/categories', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      await loadData();
    } catch (err) {
      setError(err.message || 'Unable to add category');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    setDeletingId(categoryId);
    setError('');
    try {
      await authorizedFetch(`/categories/${categoryId}`, {
        method: 'DELETE',
      });
      await loadData();
    } catch (err) {
      setError(err.message || 'Unable to delete category');
    } finally {
      setDeletingId(null);
    }
  };

  const productCounts = useMemo(() => {
    return products.reduce((acc, product) => {
      acc[product.categoryId] = (acc[product.categoryId] || 0) + 1;
      return acc;
    }, {});
  }, [products]);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#f5f5f5]">
      <div className="flex min-h-screen flex-col md:flex-row">
        <NavBar />
        <main className="flex-1 space-y-6 px-4 py-6 md:px-10 md:py-10">
          <header className="space-y-2">
            <p className="text-xs uppercase tracking-[0.5em] text-[#6f6f6f]">Categories</p>
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <h1 className="text-3xl font-semibold">Product taxonomy</h1>
              <p className="text-sm text-[#b0b0b0]">
                Keep inventory organized by maintaining crisp categories.
              </p>
            </div>
          </header>

          {error && (
            <div className="rounded-md border border-[#3d1c1c] bg-[#170c0c] px-4 py-3 text-sm text-[#fdaaaa]">
              {error}
            </div>
          )}

          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-[#262626] bg-[#111111] p-5">
              <p className="text-xs uppercase tracking-[0.4em] text-[#6f6f6f]">Total</p>
              <p className="text-3xl font-semibold">{categories.length}</p>
              <span className="text-sm text-[#b0b0b0]">Categories</span>
            </div>
            <div className="rounded-lg border border-[#262626] bg-[#111111] p-5">
              <p className="text-xs uppercase tracking-[0.4em] text-[#6f6f6f]">Inventory</p>
              <p className="text-3xl font-semibold">{products.length}</p>
              <span className="text-sm text-[#b0b0b0]">Products tracked</span>
            </div>
            <div className="rounded-lg border border-[#262626] bg-[#111111] p-5">
              <p className="text-xs uppercase tracking-[0.4em] text-[#6f6f6f]">Average</p>
              <p className="text-3xl font-semibold">
                {categories.length ? Math.round((products.length / categories.length) * 10) / 10 : 0}
              </p>
              <span className="text-sm text-[#b0b0b0]">Products per category</span>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
            <CategoryForm onSubmit={handleCreateCategory} loading={formLoading} />

            {loading ? (
              <div className="rounded-lg border border-[#262626] bg-[#111111] p-10 text-center text-[#b0b0b0]">
                Loading categories...
              </div>
            ) : (
              <CategoryTable
                categories={categories}
                productCounts={productCounts}
                onDelete={handleDeleteCategory}
                deletingId={deletingId}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CategoriesPage;

