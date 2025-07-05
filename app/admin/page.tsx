"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  BarChart3,
  Diamond,
  Globe,
  Grid,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { api } from "@/app/services/api"
import { Product } from "@/app/types"

const BASE_URL = 'https://your-api-base-url.com/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editPrice, setEditPrice] = useState<number | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin_token")
      if (!token) {
        router.replace("/admin/login")
        return
      }
      fetchProducts(token)
    }
    // eslint-disable-next-line
  }, [])

  const fetchProducts = async (token: string) => {
    setLoadingProducts(true)
    setError(null)
    try {
      const res = await api.getProducts(token)
      let productList: Product[] = []
      if (Array.isArray(res.product)) productList = res.product
      else if (res.product) productList = [res.product]
      setProducts(productList)
    } catch (e: any) {
      setError(e?.message || "Failed to fetch products")
    } finally {
      setLoadingProducts(false)
    }
  }

  const handleEdit = (id: string, price: number) => {
    setEditId(id)
    setEditPrice(price)
    setMessage(null)
    setError(null)
  }

  const handleCancel = () => {
    setEditId(null)
    setEditPrice(null)
    setMessage(null)
    setError(null)
  }

  const handleSave = async (id: string) => {
    const token = localStorage.getItem("admin_token")
    if (!token || editPrice === null) return
    setError(null)
    setMessage(null)
    try {
      await api.updateProduct(id, { price: editPrice }, token)
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, price: editPrice } : p)))
      setMessage("Price updated successfully.")
      setEditId(null)
      setEditPrice(null)
    } catch (e: any) {
      setError(e?.message || "Failed to update price")
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <Diamond className="h-6 w-6" />
              <span className="font-bold">Ton Store Admin</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={activeTab === "overview"} onClick={() => setActiveTab("overview")}>
                  <button>
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Overview</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={activeTab === "assets"} onClick={() => setActiveTab("assets")}>
                  <button>
                    <Package className="h-4 w-4" />
                    <span>Digital Assets</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={activeTab === "auctions"} onClick={() => setActiveTab("auctions")}>
                  <button>
                    <ShoppingCart className="h-4 w-4" />
                    <span>Auctions</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={activeTab === "domains"} onClick={() => setActiveTab("domains")}>
                  <button>
                    <Globe className="h-4 w-4" />
                    <span>Domains</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={activeTab === "users"} onClick={() => setActiveTab("users")}>
                  <button>
                    <Users className="h-4 w-4" />
                    <span>Users</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={activeTab === "analytics"}
                  onClick={() => setActiveTab("analytics")}
                >
                  <button>
                    <BarChart3 className="h-4 w-4" />
                    <span>Analytics</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={activeTab === "settings"} onClick={() => setActiveTab("settings")}>
                  <button>
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Store</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button>
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 overflow-auto">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                Help
              </Button>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-medium">AD</span>
              </div>
            </div>
          </header>
          <main className="flex-1 p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="assets">Digital Assets</TabsTrigger>
                <TabsTrigger value="auctions">Auctions</TabsTrigger>
                <TabsTrigger value="domains">Domains</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">128,430 TON</div>
                      <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Auctions</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">24</div>
                      <p className="text-xs text-muted-foreground">+12 new this week</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Registered Domains</CardTitle>
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">12,234</div>
                      <p className="text-xs text-muted-foreground">+2,345 from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">573</div>
                      <p className="text-xs text-muted-foreground">+201 new users</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Revenue Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                        <p className="text-muted-foreground">Revenue Chart Placeholder</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Recent Sales</CardTitle>
                      <CardDescription>You made 265 sales this month.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-8">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="flex items-center">
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                              <span className="text-xs font-medium">U{i}</span>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">User{i}@example.com</p>
                              <p className="text-sm text-muted-foreground">Purchased Domain{i}.ton</p>
                            </div>
                            <div className="ml-auto font-medium">{(Math.random() * 100).toFixed(2)} TON</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="assets" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Digital Assets</CardTitle>
                      <Button>Add New Asset</Button>
                    </div>
                    <CardDescription>Manage your digital assets on the TON blockchain</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingProducts ? (
                      <div className="text-center py-8">Loading products...</div>
                    ) : error ? (
                      <div className="text-center text-red-500 py-8">{error}</div>
                    ) : (
                      <>
                        {message && <div className="text-green-600 text-center mb-4">{message}</div>}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {products.map((product) => (
                            <div key={product.id} className="rounded-lg border bg-card text-card-foreground shadow-sm">
                              <div className="aspect-square bg-muted flex items-center justify-center">
                                <span className="font-bold text-2xl">{product.name}</span>
                              </div>
                              <div className="p-4">
                                <h3 className="font-semibold">{product.name}</h3>
                                <p className="text-sm text-muted-foreground">Type: {product.type}</p>
                                <div className="mt-2 flex items-center justify-between">
                                  <span className="text-sm">Price</span>
                                  {editId === product.id ? (
                                    <input
                                      type="number"
                                      value={editPrice ?? product.price}
                                      onChange={(e) => setEditPrice(Number(e.target.value))}
                                      className="w-24 rounded border px-2 py-1 text-sm"
                                      min={0}
                                      step={0.01}
                                    />
                                  ) : (
                                    <span className="font-medium">{product.price} TON</span>
                                  )}
                                </div>
                                <div className="mt-4 flex gap-2">
                                  {editId === product.id ? (
                                    <>
                                      <Button size="sm" variant="default" className="flex-1" onClick={() => handleSave(product.id)}>
                                        Save
                                      </Button>
                                      <Button size="sm" variant="outline" className="flex-1" onClick={handleCancel}>
                                        Cancel
                                      </Button>
                                    </>
                                  ) : (
                                    <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEdit(product.id, product.price)}>
                                      Edit
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="auctions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Active Auctions</CardTitle>
                      <Button>Create Auction</Button>
                    </div>
                    <CardDescription>Manage your active auctions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-5 p-4 font-medium">
                        <div>Item</div>
                        <div>Current Bid</div>
                        <div>Bids</div>
                        <div>Time Left</div>
                        <div>Actions</div>
                      </div>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="grid grid-cols-5 items-center border-t p-4">
                          <div className="font-medium">Auction Item #{i}</div>
                          <div>{(Math.random() * 1000).toFixed(2)} TON</div>
                          <div>{Math.floor(Math.random() * 20)}</div>
                          <div>{Math.floor(Math.random() * 24)} hours</div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                            <Button size="sm" variant="destructive">
                              End
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="domains" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Domain Management</CardTitle>
                      <Button>Add Domain</Button>
                    </div>
                    <CardDescription>Manage .ton domains</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-4 p-4 font-medium">
                        <div>Domain</div>
                        <div>Status</div>
                        <div>Owner</div>
                        <div>Actions</div>
                      </div>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="grid grid-cols-4 items-center border-t p-4">
                          <div className="font-medium">domain{i}.ton</div>
                          <div>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                i % 3 === 0
                                  ? "bg-yellow-100 text-yellow-800"
                                  : i % 2 === 0
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {i % 3 === 0 ? "Pending" : i % 2 === 0 ? "Active" : "Registered"}
                            </span>
                          </div>
                          <div>user{i}@example.com</div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                            <Button size="sm" variant="destructive">
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="users" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>User Management</CardTitle>
                      <Button>Add User</Button>
                    </div>
                    <CardDescription>Manage users of the Ton Store platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-5 p-4 font-medium">
                        <div>User</div>
                        <div>Email</div>
                        <div>Status</div>
                        <div>Joined</div>
                        <div>Actions</div>
                      </div>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="grid grid-cols-5 items-center border-t p-4">
                          <div className="font-medium">User {i}</div>
                          <div>user{i}@example.com</div>
                          <div>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                i % 3 === 0 ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {i % 3 === 0 ? "Active" : "Verified"}
                            </span>
                          </div>
                          <div>{new Date().toLocaleDateString()}</div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                            <Button size="sm" variant="destructive">
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="analytics" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics Dashboard</CardTitle>
                    <CardDescription>View detailed analytics for your Ton Store platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                      <div className="rounded-lg border p-4">
                        <h3 className="mb-4 text-lg font-medium">Sales Overview</h3>
                        <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                          <p className="text-muted-foreground">Sales Chart Placeholder</p>
                        </div>
                      </div>
                      <div className="rounded-lg border p-4">
                        <h3 className="mb-4 text-lg font-medium">User Growth</h3>
                        <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                          <p className="text-muted-foreground">User Growth Chart Placeholder</p>
                        </div>
                      </div>
                      <div className="rounded-lg border p-4">
                        <h3 className="mb-4 text-lg font-medium">Domain Registrations</h3>
                        <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                          <p className="text-muted-foreground">Domain Chart Placeholder</p>
                        </div>
                      </div>
                      <div className="rounded-lg border p-4">
                        <h3 className="mb-4 text-lg font-medium">Auction Activity</h3>
                        <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                          <p className="text-muted-foreground">Auction Chart Placeholder</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Settings</CardTitle>
                    <CardDescription>Manage your Ton Store platform settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">General Settings</h3>
                      <div className="rounded-lg border p-4 space-y-4">
                        <div className="grid gap-2">
                          <label htmlFor="site-name" className="text-sm font-medium">
                            Site Name
                          </label>
                          <input
                            id="site-name"
                            type="text"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            defaultValue="Ton Store"
                          />
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="site-description" className="text-sm font-medium">
                            Site Description
                          </label>
                          <textarea
                            id="site-description"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            rows={3}
                            defaultValue="The premier marketplace for digital assets on the TON blockchain"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Fee Settings</h3>
                      <div className="rounded-lg border p-4 space-y-4">
                        <div className="grid gap-2">
                          <label htmlFor="transaction-fee" className="text-sm font-medium">
                            Transaction Fee (%)
                          </label>
                          <input
                            id="transaction-fee"
                            type="number"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            defaultValue="2.5"
                            min="0"
                            max="100"
                            step="0.1"
                          />
                        </div>
                        <div className="grid gap-2">
                          <label htmlFor="domain-fee" className="text-sm font-medium">
                            Domain Registration Fee (TON)
                          </label>
                          <input
                            id="domain-fee"
                            type="number"
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            defaultValue="5"
                            min="0"
                            step="0.1"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button>Save Settings</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

