import { X, Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

interface Product {
  id: string | null;
  name: string;
  price: number;
  image_url: string;
  description: string;
  is_active: boolean;
}

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
}

type Order = {
  id: string;
  created_at: string;
  customer_name: string | null;
  customer_phone: string | null;
  total: number;
};

type OrderItem = {
  id: string;
  order_id: string;
  product_name: string;
  price: number;
  quantity: number;
  image_url: string | null;
};

export function AdminPanel({ isOpen, onClose, products, onUpdateProducts }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  // Login Supabase
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
  if (!isOpen) return;

  let unsubscribe: null | (() => void) = null;

  (async () => {
    // ✅ fuerza login siempre al ABRIR el panel
    await supabase.auth.signOut();
    setIsAuthenticated(false);

    const { data } = await supabase.auth.getSession();
    setIsAuthenticated(!!data.session);

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    unsubscribe = () => sub.subscription.unsubscribe();
  })();

  return () => {
    if (unsubscribe) unsubscribe();
  };
}, [isOpen]);

useEffect(() => {
  if (isOpen) return;

  // cuando se cierra el panel
  setActiveTab("products");
  setSelectedOrder(null);
  setOrderItems([]);
  setOrders([]);
}, [isOpen]);

  // CRUD
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',      
    image_url: '',
    description: '',
    is_active: true
  });

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert('Correo o contraseña incorrectos');
    setPassword('');
    return;
  }

    setIsAuthenticated(true);
    setPassword('');
  };

  const handleAddProduct = () => {
  setEditingProduct({
    id: null,           // Supabase lo genera
    name: '',
    description: '',
    price: 0,
    image_url: '',
    is_active: true
  });

  setFormData({
    name: '',
    price: '',
    image_url: '',
    description: '',
    is_active: true
  });
};

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setEmail("");
    setPassword("");
    setEditingProduct(null);
  };

  const handleEditProduct = (product: Product) => {
  setEditingProduct(product);
  setFormData({
    name: product.name,
    price: String(product.price), // input maneja string
    image_url: product.image_url,
    description: product.description,
    is_active: product.is_active
  });
};

  const handleSaveProduct = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!editingProduct) return;

  // Validaciones básicas
  const priceNum = Number(formData.price);
  if (Number.isNaN(priceNum) || priceNum < 0) {
    alert("El precio debe ser un número válido.");
    return;
  }

  const payload = {
    name: formData.name.trim(),
    description: formData.description.trim(),
    price: priceNum,
    image_url: formData.image_url.trim(),
    is_active: formData.is_active,
  };

  if (!payload.name) {
    alert("El nombre es obligatorio.");
    return;
  }

  // INSERT (nuevo) o UPDATE (existente)
  if (editingProduct.id) {
    const { error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", editingProduct.id);

    if (error) {
      console.error(error);
      alert("No se pudo actualizar el producto.");
      return;
    }
  } else {
    const { error } = await supabase
      .from("products")
      .insert([payload]);

    if (error) {
      console.error(error);
      alert("No se pudo crear el producto.");
      return;
    }
  }

  // Volver a leer productos desde Supabase para mantener todo sincronizado
  const { data, error: readError } = await supabase
    .from("products")
    .select("id,name,description,price,image_url,is_active,created_at")
    .order("created_at", { ascending: false });

  if (readError) {
    console.error(readError);
    alert("Se guardó, pero no se pudieron recargar los productos.");
    setEditingProduct(null);
    return;
  }

  // Actualiza el estado en el padre (catálogo)
  onUpdateProducts((data ?? []) as any);

  // Limpieza del formulario
  setEditingProduct(null);
  setFormData({
    name: "",
    price: "",
    image_url: "",
    description: "",
    is_active: true,
  });
};

  const handleDeleteProduct = async (id: string) => {
  if (!confirm("¿Estás seguro de eliminar este producto?")) return;

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    alert("No se pudo eliminar el producto.");
    return;
  }

  // Recargar productos desde Supabase
  const { data, error: readError } = await supabase
    .from("products")
    .select("id,name,description,price,image_url,is_active,created_at")
    .order("created_at", { ascending: false });

  if (readError) {
    console.error(readError);
    alert("Se eliminó, pero no se pudieron recargar los productos.");
    return;
  }

  onUpdateProducts((data ?? []) as any);
};

const loadOrders = async () => {
  const { data, error } = await supabase
    .from("orders")
    .select("id, created_at, customer_name, customer_phone, total")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    alert("No se pudieron cargar los pedidos.");
    return;
  }

  setOrders((data ?? []) as any);
};

const openOrder = async (order: Order) => {
  setSelectedOrder(order);

  const { data, error } = await supabase
    .from("order_items")
    .select("id, order_id, product_name, price, quantity, image_url")
    .eq("order_id", order.id);

  if (error) {
    console.error(error);
    alert("No se pudieron cargar los productos del pedido.");
    return;
  }

  setOrderItems((data ?? []) as any);
};

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, value, type } = e.target;

  if (type === "checkbox") {
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
    return;
  }

  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};

  const handleUploadImage = async (file: File) => {
  // ✅ VALIDACIONES ANTES
  if (!file.type.startsWith("image/")) {
    alert("Solo se permiten imágenes.");
    return;
  }

  const maxMB = 5;
  if (file.size > maxMB * 1024 * 1024) {
    alert(`La imagen no puede pasar de ${maxMB}MB.`);
    return;
  }

  try {
    setUploading(true);

    const ext = file.name.split(".").pop() || "jpg";
    const safeUUID =
      (crypto as any).randomUUID?.() ??
      `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const fileName = `${safeUUID}.${ext}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("products").getPublicUrl(filePath);

    setFormData((prev) => ({
      ...prev,
      image_url: data.publicUrl,
    }));
  } catch (err) {
    console.error(err);
    alert("No se pudo subir la imagen.");
  } finally {
    setUploading(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl">Panel de Administracion</h2>
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="hover:text-primary transition-colors text-sm"
              >
                Salir
              </button>
            )}
            <button onClick={onClose} className="hover:text-primary transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto">
              <h3 className="text-xl mb-6 text-center">Iniciar Sesión</h3>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="admin-email" className="block mb-2">Correo</label>
                  <input
                    type="email"
                    id="admin-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="admin@tudominio.com"
                  />
                </div>
                <div>
                  <label htmlFor="admin-password" className="block mb-2">Contraseña</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="admin-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 pr-12 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Introduce la contraseña"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Usa el correo y contraseña del admin que se te fue proporcionado</p>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-primary text-primary-foreground px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
                >
                  Iniciar Sesión
                </button>
              </form>
            </div>
                    ) : editingProduct ? (
            <div>
              <h3 className="text-xl mb-6">{editingProduct.name ? 'Editar' : 'Agregar'} Producto</h3>
              <form onSubmit={handleSaveProduct} className="space-y-4 max-w-2xl">
                <div>
                  <label htmlFor="product-name" className="block mb-2">Nombre del Producto</label>
                  <input
                    type="text"
                    id="product-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Ej: Rosa Eterna Individual"
                  />
                </div>

                <div>
                  <label htmlFor="product-price" className="block mb-2">Precio</label>
                  <input
                    type="number"
                    id="product-price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min={0}
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Ej: $1545"
                  />
                </div>

                <div>
                  <label htmlFor="product-image" className="block mb-2">
                    Imagen del producto
                  </label>

                  <input
                    type="url"
                    id="product-image"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />

                  <div className="mt-3">
                    <label className="block mb-2 text-sm text-muted-foreground">
                      O sube una imagen desde tu PC
                    </label>
                    <input
                      type="file"
                      accept="image/*,.jpg,.jpeg,.png,.webp"
                      disabled={uploading}
                      className="w-full text-sm file:mr-4 file:py-2 file:px-4
                                file:rounded-lg file:border-0
                                file:bg-secondary file:text-secondary-foreground
                                hover:file:opacity-90
                                disabled:opacity-50 disabled:cursor-not-allowed"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadImage(file);
                        e.currentTarget.value = "";
                      }}
                    />
                  </div>

                  {formData.image_url && (
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="mt-2 w-32 h-32 object-cover rounded-lg"
                    />
                  )}
                </div>

                <div>
                  <label htmlFor="product-description" className="block mb-2">Descripción</label>
                  <textarea
                    id="product-description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Descripción breve del producto"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-primary text-primary-foreground px-8 py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? "Subiendo imagen..." : "Guardar Producto"}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="flex-1 bg-secondary text-secondary-foreground px-8 py-3 rounded-full hover:opacity-90 transition-opacity"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div>
              {/* Header + Tabs */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl">
                  {activeTab === "products"
                    ? `Productos (${products.length})`
                    : `Pedidos (${orders.length})`}
                </h3>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("products");
                      setSelectedOrder(null);
                    }}
                    className={`px-6 py-2 rounded-full hover:opacity-90 transition-opacity ${
                      activeTab === "products"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    Productos
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      setActiveTab("orders");
                      setSelectedOrder(null);
                      await loadOrders();
                    }}
                    className={`px-6 py-2 rounded-full hover:opacity-90 transition-opacity ${
                      activeTab === "orders"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    Pedidos
                  </button>
                </div>
              </div>

              {activeTab === "products" ? (
                <>
                  {/* TU LISTA ORIGINAL DE PRODUCTOS */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl">Productos ({products.length})</h3>
                    <button
                      onClick={handleAddProduct}
                      className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-full hover:opacity-90 transition-opacity"
                    >
                      <Plus className="w-5 h-5" />
                      Agregar Producto
                    </button>
                  </div>

                  <div className="space-y-4">
                    {products.map(product => (
                      <div key={product.id} className="flex gap-4 bg-background rounded-lg p-4">
                        <img src={product.image_url} alt={product.name} className="w-20 h-20 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h4 className="mb-1">{product.name}</h4>
                          <p className="text-primary mb-1">RD${product.price.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{product.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="h-10 px-4 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors flex items-center gap-2"
                          >
                            <Edit2 className="w-4 h-4" />
                            Editar
                          </button>
                          <button
                            onClick={() => product.id && handleDeleteProduct(product.id)}
                            className="h-10 px-4 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}

                    {products.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        No hay productos. Haz clic en "Agregar Producto" para comenzar.
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* PEDIDOS */}
                  <div className="space-y-4">
                    {orders.map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => openOrder(o)}
                        className="w-full text-left flex items-center justify-between gap-4 bg-background rounded-lg p-4 hover:opacity-90 transition-opacity"
                      >
                        <div>
                          <h4 className="mb-1">Pedido #{o.id.slice(0, 8).toUpperCase()}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(o.created_at).toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Cliente: {o.customer_name ?? "Sin nombre"}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-primary font-semibold">RD${o.total.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">
                            {o.customer_phone ?? "Sin teléfono"}
                          </p>
                        </div>
                      </button>
                    ))}

                    {orders.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        No hay pedidos todavía.
                      </div>
                    )}
                  </div>

                  {selectedOrder && (
                    <div className="mt-6 bg-background rounded-lg p-4 border border-border">
                      <h4 className="mb-2">
                        Detalle Pedido #{selectedOrder.id.slice(0, 8).toUpperCase()}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Fecha: {new Date(selectedOrder.created_at).toLocaleString()}
                      </p>

                      <div className="space-y-3">
                        {orderItems.map((it) => (
                          <div key={it.id} className="flex gap-4 bg-background rounded-lg p-4 border border-border">
                            {it.image_url ? (
                              <img src={it.image_url} alt={it.product_name} className="w-16 h-16 object-cover rounded-lg" />
                            ) : (
                              <div className="w-16 h-16 rounded-lg bg-secondary" />
                            )}

                            <div className="flex-1">
                              <h4 className="mb-1">{it.product_name}</h4>
                              <p className="text-sm text-muted-foreground">
                                RD${it.price.toLocaleString()} x {it.quantity}
                              </p>
                            </div>

                            <div className="font-semibold">
                              RD${(it.price * it.quantity).toLocaleString()}
                            </div>
                          </div>
                        ))}

                        {orderItems.length === 0 && (
                          <div className="text-center py-6 text-muted-foreground">
                            Este pedido no tiene productos.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
                    )}
        </div>
      </div>
    </div>
  );
}




