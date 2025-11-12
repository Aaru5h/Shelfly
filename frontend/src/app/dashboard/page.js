import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
      <Card className="w-[350px] bg-gray-800 border-gray-700 shadow-lg">
        <CardHeader>
          <CardTitle className="text-gray-100">Dashboard</CardTitle>
          <CardDescription className="text-gray-400">Welcome to your inventory dashboard!</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-gray-300">From here, you can manage your products and inventory.</p>
          <div className="flex flex-col space-y-2">
            <Link href="/products" passHref>
              <Button className="w-full bg-gray-700 hover:bg-gray-600 text-gray-100 border border-gray-600">
                View Products
              </Button>
            </Link>
            <Button className="w-full bg-gray-700 hover:bg-gray-600 text-gray-100 border border-gray-600">
              Add New Product
            </Button>
            <Button className="w-full bg-red-600 hover:bg-red-700 text-gray-100 border border-red-500">
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
