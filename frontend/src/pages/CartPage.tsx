import { Button } from '@/components/ui/button'
import { useCart } from '@/context/CartContext'

export function CartPage() {
  const { items, removeItem, updateQty, total } = useCart()

  return (
    <div className="max-w-2xl mx-auto brutal p-6 space-y-4">
      <h1 className="text-2xl font-black">Your cart</h1>
      {items.length === 0 ? (
        <p className="text-muted-foreground">Items you add will appear here.</p>
      ) : (
        <div className="space-y-3">
          {items.map((i) => (
            <div key={i.productId} className="flex items-center justify-between brutal p-3">
              <div>
                <div className="font-semibold">{i.name}</div>
                <div className="text-sm text-muted-foreground">${(i.price * i.quantity).toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-2">
                <Button className="brutal" onClick={() => updateQty(i.productId, Math.max(1, i.quantity - 1))}>-</Button>
                <span className="w-8 text-center">{i.quantity}</span>
                <Button className="brutal" onClick={() => updateQty(i.productId, i.quantity + 1)}>+</Button>
                <Button variant="destructive" className="brutal" onClick={() => removeItem(i.productId)}>Remove</Button>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between brutal p-3">
            <div className="font-semibold">Total</div>
            <div>${total.toFixed(2)}</div>
          </div>
        </div>
      )}
      <div className="flex justify-end">
        <Button className="brutal" disabled={items.length === 0}>
          Checkout
        </Button>
      </div>
    </div>
  )
}
