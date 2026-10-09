import { useEffect, useState } from "react";
import { api, apiErrorMessage } from "../../lib/api";
import type { AdminProduct, ProductFormState } from "../../lib/types";

const CATEGORIES = [
  "Tops & Blouses",
  "Dresses & Skirts",
  "Outerwear & Layers",
  "Accessories",
];

const emptyForm: ProductFormState = {
  name: "",
  category: "Dresses & Skirts",
  price: "",
  compareAtPrice: "",
  description: "",
  sizes: "",
  colors: "",
  stock: "0",
  image: "",
  hover: "",
  isFeatured: false,
  isNew: true,
  isBestseller: false,
  active: true,
};

export default function ProductsAdmin() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminProduct | "new" | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [saved, setSaved] = useState(false);

  function load(silent = false) {
    if (!silent) setError(null);
    api
      .get<{ products: AdminProduct[] }>("/admin/products?limit=100")
      .then((res) => setProducts(res.data.products))
      .catch((e) => setError(apiErrorMessage(e)));
  }

  useEffect(() => {
    load();
  }, []);

  function set<K extends keyof ProductFormState>(key: K, value: ProductFormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function openNew() {
    setEditing("new");
    setForm(emptyForm);
    setSaved(false);
  }

  function openEdit(p: AdminProduct) {
    setEditing(p);
    setForm({
      name: p.name,
      category: p.category,
      price: String(p.price),
      compareAtPrice: p.compareAtPrice ? String(p.compareAtPrice) : "",
      description: p.description,
      sizes: p.sizes.join(", "),
      colors: p.colors.join(", "),
      stock: String(p.stock),
      image: p.image,
      hover: p.hover ?? "",
      isFeatured: p.isFeatured,
      isNew: p.isNew,
      isBestseller: p.isBestseller,
      active: p.active,
    });
    setSaved(false);
  }

  async function toggleFeatured(p: AdminProduct) {
    try {
      await api.put(`/admin/products/${p.id}`, { isFeatured: !p.isFeatured });
      load(true);
    } catch (e) {
      setError(apiErrorMessage(e));
    }
  }

  async function toggleActive(p: AdminProduct) {
    try {
      await api.put(`/admin/products/${p.id}`, { active: !p.active });
      load(true);
    } catch (e) {
      setError(apiErrorMessage(e));
    }
  }

  async function deactivate(p: AdminProduct) {
    if (!window.confirm(`Remove "${p.name}" from the store?`)) return;
    try {
      await api.delete(`/admin/products/${p.id}`);
      load(true);
    } catch (e) {
      setError(apiErrorMessage(e));
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const payload: Record<string, unknown> = {
      name: form.name,
      category: form.category,
      price: form.price,
      compareAtPrice: form.compareAtPrice || "",
      description: form.description,
      sizes: form.sizes,
      colors: form.colors,
      stock: form.stock,
      isFeatured: form.isFeatured,
      isNew: form.isNew,
      isBestseller: form.isBestseller,
      active: form.active,
      image: form.image,
      hover: form.hover,
    };
    const imageFile = (e.target as HTMLFormElement).imageFile
      ?.files?.[0] as File | undefined;
    const hoverFile = (e.target as HTMLFormElement).hoverFile
      ?.files?.[0] as File | undefined;

    try {
      if (imageFile || hoverFile) {
        const fd = new FormData();
        for (const [k, v] of Object.entries(payload)) {
          if (v !== undefined) fd.append(k, String(v));
        }
        if (imageFile) fd.append("image", imageFile);
        if (hoverFile) fd.append("hover", hoverFile);
        if (editing === "new") {
          await api.post("/admin/products", fd);
        } else if (editing !== null) {
          await api.put(`/admin/products/${editing.id}`, fd);
        } else {
          return;
        }
      } else if (editing === "new") {
        await api.post("/admin/products", payload);
      } else if (editing !== null) {
        await api.put(`/admin/products/${editing.id}`, payload);
      } else {
        return;
      }
      setSaved(true);
      setEditing(null);
      load(true);
    } catch (err) {
      setError(apiErrorMessage(err));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display font-condensed text-3xl font-black uppercase tracking-tight">
          Products
        </h1>
        <button
          type="button"
          onClick={openNew}
          className="bg-ink px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-cream transition-colors hover:bg-terra"
        >
          {editing === "new" ? "Editing new" : "+ Add Product"}
        </button>
      </div>

      {error && (
        <p className="mt-4 border border-terra/30 bg-terra/5 px-4 py-3 text-sm text-terra">
          {error}
        </p>
      )}

      <div className="mt-6 overflow-x-auto border border-ink/10 bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-[10px] uppercase tracking-[0.18em] text-ink/40">
              <th className="px-4 py-3 font-semibold">Product</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Stock</th>
              <th className="px-4 py-3 font-semibold">Flags</th>
              <th className="px-4 py-3 font-semibold">Active</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-ink/5">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-9 shrink-0 overflow-hidden bg-sand/60">
                      <img src={p.image} alt="" className="h-full w-full object-cover" />
                    </div>
                    <span className="font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink/60">{p.category}</td>
                <td className="px-4 py-3 tabular-nums">${p.price.toFixed(2)}</td>
                <td className="px-4 py-3 tabular-nums">
                  <span className={p.stock <= 5 ? "font-semibold text-terra" : ""}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {p.isNew && <Badge>New</Badge>}
                    {p.isBestseller && <Badge>Sale</Badge>}
                    {p.isFeatured && <Badge dim>Featured</Badge>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleActive(p)}
                    className={`h-6 w-11 rounded-full p-0.5 transition-colors ${
                      p.active ? "bg-ink" : "bg-ink/15"
                    }`}
                    aria-label={p.active ? "Deactivate" : "Activate"}
                  >
                    <span
                      className={`block h-5 w-5 rounded-full bg-cream transition-transform ${
                        p.active ? "translate-x-[18px]" : ""
                      }`}
                    />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => openEdit(p)}
                      className="text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors hover:text-terra"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleFeatured(p)}
                      title="Toggle featured"
                      className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/40 transition-colors hover:text-terra"
                    >
                      {p.isFeatured ? "Unfeature" : "Feature"}
                    </button>
                    <button
                      type="button"
                      onClick={() => deactivate(p)}
                      className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/40 transition-colors hover:text-terra"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {saved && <p className="mt-4 text-sm text-ink/60">Saved.</p>}

      {editing && (
        <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm sm:p-8">
          <form
            onSubmit={(e) => void submit(e)}
            className="w-full max-w-2xl bg-cream p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display font-condensed text-2xl font-black uppercase tracking-tight">
                {editing === "new" ? "New Product" : "Edit Product"}
              </h2>
              <button
                type="button"
                onClick={() => setEditing(null)}
                aria-label="Close"
                className="text-ink/50 transition-colors hover:text-terra"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Name *" className="sm:col-span-2">
                <input
                  required
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className="w-full border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
                />
              </Field>

              <Field label="Category *">
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className="w-full border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Price (USD) *">
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  className="w-full border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
                />
              </Field>

              <Field label="Compare-at price">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.compareAtPrice}
                  onChange={(e) => set("compareAtPrice", e.target.value)}
                  className="w-full border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
                />
              </Field>

              <Field label="Stock">
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => set("stock", e.target.value)}
                  className="w-full border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
                />
              </Field>

              <Field label="Sizes (comma separated)" className="sm:col-span-2">
                <input
                  value={form.sizes}
                  onChange={(e) => set("sizes", e.target.value)}
                  placeholder="XS, S, M, L, XL"
                  className="w-full border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
                />
              </Field>

              <Field label="Colors (comma separated)" className="sm:col-span-2">
                <input
                  value={form.colors}
                  onChange={(e) => set("colors", e.target.value)}
                  placeholder="Cream, Terra"
                  className="w-full border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
                />
              </Field>

              <Field label="Description" className="sm:col-span-2">
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  className="w-full resize-y border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
                />
              </Field>

              <Field label="Image URL" className="sm:col-span-2">
                <input
                  value={form.image}
                  onChange={(e) => set("image", e.target.value)}
                  placeholder="https://…"
                  className="w-full border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
                />
              </Field>
              <Field label="Upload image" className="sm:col-span-2">
                <input
                  name="imageFile"
                  type="file"
                  accept="image/*"
                  className="w-full text-sm text-ink/60 file:mr-3 file:border-0 file:bg-ink file:px-3 file:py-2 file:text-[11px] file:font-semibold file:uppercase file:tracking-[0.15em] file:text-cream"
                />
              </Field>

              <Field label="Hover image URL" className="sm:col-span-2">
                <input
                  value={form.hover}
                  onChange={(e) => set("hover", e.target.value)}
                  placeholder="https://…"
                  className="w-full border border-ink/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
                />
              </Field>
              <Field label="Upload hover image" className="sm:col-span-2">
                <input
                  name="hoverFile"
                  type="file"
                  accept="image/*"
                  className="w-full text-sm text-ink/60 file:mr-3 file:border-0 file:bg-ink file:px-3 file:py-2 file:text-[11px] file:font-semibold file:uppercase file:tracking-[0.15em] file:text-cream"
                />
              </Field>

              <div className="flex flex-wrap gap-5 sm:col-span-2">
                <Toggle label="New arrival" checked={form.isNew} onChange={(v) => set("isNew", v)} />
                <Toggle label="Bestseller" checked={form.isBestseller} onChange={(v) => set("isBestseller", v)} />
                <Toggle label="Featured" checked={form.isFeatured} onChange={(v) => set("isFeatured", v)} />
                <Toggle label="Active" checked={form.active} onChange={(v) => set("active", v)} />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/50 transition-colors hover:text-ink"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-ink px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-cream transition-colors hover:bg-terra"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Badge({ children, dim }: { children: React.ReactNode; dim?: boolean }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] ${
        dim ? "bg-ink/10 text-ink/60" : "bg-sand text-ink"
      }`}
    >
      {children}
    </span>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/50">
        {label}
      </span>
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`h-6 w-11 rounded-full p-0.5 transition-colors ${
          checked ? "bg-ink" : "bg-ink/15"
        }`}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-cream transition-transform ${
            checked ? "translate-x-[18px]" : ""
          }`}
        />
      </button>
      {label}
    </label>
  );
}