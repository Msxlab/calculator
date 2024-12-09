interface ExtraService {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }
  
  export default function Extras({ onUpdate }) {
    const [extras, setExtras] = useState<ExtraService[]>([
      { id: 'install', name: 'Installation', price: 0, quantity: 1 },
      { id: 'template', name: 'Template', price: 0, quantity: 1 },
      { id: 'faucetHole', name: 'Faucet Hole', price: 45, quantity: 0 },
      // Diğer hizmetler...
    ]);
  
    return (
      <div className="space-y-4">
        {extras.map(extra => (
          <div key={extra.id} className="flex items-center justify-between">
            <span>{extra.name}</span>
            <div className="flex space-x-4">
              <input
                type="number"
                value={extra.price}
                onChange={e => handlePriceChange(extra.id, e.target.value)}
                className="w-24 px-2 py-1 border rounded"
              />
              <input
                type="number"
                value={extra.quantity}
                onChange={e => handleQuantityChange(extra.id, e.target.value)}
                className="w-20 px-2 py-1 border rounded"
              />
            </div>
          </div>
        ))}
      </div>
    );
  }