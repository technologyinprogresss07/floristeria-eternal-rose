import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase"; // ajusta la ruta si tu supabase está en otro lugar

const ADMIN_UID = "6a913746-8210-4891-8089-1167ac7ddbf7"; // el uid del user admin en Supabase

type DbProduct = {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image_url: string;
};

export function AdminPage() {
  const [sessionUid, setSessionUid] = useState<string | null>(null);

  // login form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // add product form
  const [name, setName] = useState("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    // 1) leer sesión actual
    supabase.auth.getSession().then(({ data }) => {
      setSessionUid(data.session?.user?.id ?? null);
    });

    // 2) escuchar cambios de auth
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUid(session?.user?.id ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const isAdmin = sessionUid === ADMIN_UID;

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("id,name,price,description,image_url")
      .order("created_at", { ascending: false });

    if (error) {
      setMsg("Error cargando productos: " + error.message);
      return;
    }
    setProducts((data as DbProduct[]) ?? []);
  };

  useEffect(() => {
    if (isAdmin) loadProducts();
  }, [isAdmin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) setMsg("Login error: " + error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setProducts([]);
    setMsg("");
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");

    if (!imageFile) {
      setMsg("Selecciona una imagen.");
      return;
    }

    setLoading(true);

    try {
      // 1) subir imagen al bucket products
      const ext = imageFile.name.split(".").pop() || "jpg";
      const filePath = `products/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, imageFile, { upsert: false });

      if (uploadError) throw uploadError;

      // 2) obtener URL pública (bucket debe ser public)
      const { data: pub } = supabase.storage.from("products").getPublicUrl(filePath);
      const publicUrl = pub.publicUrl;

      // 3) insertar en tabla
      const priceNumber = Number(price);
      if (Number.isNaN(priceNumber)) throw new Error("Precio inválido (usa número).");

      const { error: insertError } = await supabase.from("products").insert({
        name,
        price: priceNumber,
        description: description || null,
        image_url: publicUrl,
      });

      if (insertError) throw insertError;

      // limpiar
      setName("");
      setPrice("");
      setDescription("");
      setImageFile(null);

      setMsg("✅ Producto agregado.");
      await loadProducts();
    } catch (err: any) {
      setMsg("Error: " + (err?.message ?? "desconocido"));
    } finally {
      setLoading(false);
    }
  };

  // ---- UI ----
  if (!sessionUid) {
    // no logueada
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-card border rounded-2xl p-6">
          <h1 className="text-2xl mb-4">Admin — Iniciar sesión</h1>

          {msg && <p className="mb-3 text-sm text-red-600">{msg}</p>}

          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="block mb-1">Email</label>
              <input
                className="w-full px-3 py-2 border rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Contraseña</label>
              <input
                className="w-full px-3 py-2 border rounded-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-primary text-primary-foreground rounded-full py-2 hover:opacity-90"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    // logueada pero NO es admin
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-card border rounded-2xl p-6">
          <h1 className="text-2xl mb-2">Acceso denegado</h1>
          <p className="text-muted-foreground mb-4">Este usuario no es administrador.</p>
          <button
            onClick={handleLogout}
            className="w-full bg-primary text-primary-foreground rounded-full py-2 hover:opacity-90"
          >
            Salir
          </button>
        </div>
      </div>
    );
  }

  // admin
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl">Panel Admin</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-full border hover:bg-black/5"
          >
            Cerrar sesión
          </button>
        </div>

        {msg && <p className="mb-4 text-sm">{msg}</p>}

        <div className="bg-card border rounded-2xl p-6 mb-8">
          <h2 className="text-xl mb-4">Agregar producto</h2>

          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Nombre</label>
              <input
                className="w-full px-3 py-2 border rounded-lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1">Precio (número)</label>
              <input
                className="w-full px-3 py-2 border rounded-lg"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                inputMode="decimal"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1">Descripción</label>
              <textarea
                className="w-full px-3 py-2 border rounded-lg"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1">Imagen</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                required
              />
            </div>

            <div className="md:col-span-2">
              <button
                disabled={loading}
                className="w-full bg-primary text-primary-foreground rounded-full py-2 hover:opacity-90"
              >
                {loading ? "Guardando..." : "Guardar producto"}
              </button>
            </div>
          </form>
        </div>

        <div>
          <h2 className="text-xl mb-4">Productos actuales</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <div key={p.id} className="border rounded-2xl overflow-hidden">
                <img src={p.image_url} alt={p.name} className="w-full aspect-square object-cover" />
                <div className="p-4">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-primary text-lg">${Number(p.price).toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
