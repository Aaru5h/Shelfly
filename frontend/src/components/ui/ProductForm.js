"use client"
import React from 'react'
import { useState } from 'react'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {Card, CardContent} from '@/components/ui/card'

const ProductForm = () => {

    const [form, setForm] = useState({name: '', sku: '', description: '', price: ''})

  return (
    <div>

    </div>
  )
}

export default ProductForm