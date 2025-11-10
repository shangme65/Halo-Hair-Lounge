import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id" | "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existingItem = get().items.find(
          (i) => i.productId === item.productId
        );

        if (existingItem) {
          set({
            items: get().items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
          toast.success("Item quantity updated");
        } else {
          set({
            items: [
              ...get().items,
              {
                ...item,
                id: Math.random().toString(36).substring(7),
                quantity: 1,
              },
            ],
          });
          toast.success("Item added to cart");
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
        toast.success("Item removed from cart");
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        });
      },

      clearCart: () => {
        set({ items: [] });
        toast.success("Cart cleared");
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "halo-cart-storage",
      skipHydration: typeof window === "undefined",
    }
  )
);
