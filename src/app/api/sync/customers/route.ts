// src/app/api/sync/customers/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || ''
const SHOPIFY_STORE = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || ''

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || (profile.role !== 'admin' && profile.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (!SHOPIFY_ADMIN_TOKEN || !SHOPIFY_STORE) {
      return NextResponse.json(
        { error: 'Shopify credentials not configured' },
        { status: 500 }
      )
    }

    const response = await fetch(
      `https://${SHOPIFY_STORE}/admin/api/2024-01/customers.json?limit=250`,
      {
        headers: {
          'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`)
    }

    const { customers } = await response.json()

    let synced = 0
    for (const customer of customers) {
      const email = customer.email
      if (!email) continue

      const shopifyCustomerId = `gid://shopify/Customer/${customer.id}`

      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle()

      if (existingProfile) {
        await supabaseAdmin
          .from('profiles')
          .update({
            shopify_customer_id: shopifyCustomerId,
            shopify_email: email,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingProfile.id)

        synced++
      }
    }

    return NextResponse.json({
      success: true,
      synced,
      message: `${synced} clientes sincronizados`,
    })
  } catch (error) {
    console.error('Sync customers error:', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}
