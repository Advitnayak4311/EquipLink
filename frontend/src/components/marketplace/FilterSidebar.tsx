import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMarketplaceCategories } from "@/lib/api/marketplaceService";
import { EquipmentStatus } from "@/types";

interface FilterSidebarProps {
  search: string;
  setSearch: (value: string) => void;
  category: number | string;
  setCategory: (value: number | string) => void;
  status: EquipmentStatus | "";
  setStatus: (value: EquipmentStatus | "") => void;
  location: string;
  setLocation: (value: string) => void;
  minPrice: string;
  setMinPrice: (value: string) => void;
  maxPrice: string;
  setMaxPrice: (value: string) => void;
  onClear: () => void;
}

export default function FilterSidebar({
  search,
  setSearch,
  category,
  setCategory,
  status,
  setStatus,
  location,
  setLocation,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  onClear,
}: FilterSidebarProps) {
  const { data: categories = [], isLoading: loadingCategories } = useMarketplaceCategories();

  return (
    <div className="bg-card border rounded-xl p-5 space-y-6 shadow-sm shrink-0 w-full md:w-64">
      <div className="flex items-center justify-between pb-3 border-b">
        <h3 className="font-bold text-sm tracking-wide">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onClear} className="text-xs h-8 text-primary">
          Clear All
        </Button>
      </div>

      {/* Keywords Search */}
      <div className="space-y-2">
        <Label htmlFor="search" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Keywords
        </Label>
        <Input
          id="search"
          placeholder="Name, brand, model..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 text-xs"
        />
      </div>

      {/* Categories Dropdown */}
      <div className="space-y-2">
        <Label htmlFor="category" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Category
        </Label>
        {loadingCategories ? (
          <div className="h-9 border rounded bg-muted animate-pulse" />
        ) : (
          <select
            id="category"
            suppressHydrationWarning
            value={category}
            onChange={(e) => setCategory(e.target.value ? Number(e.target.value) : "")}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs ring-offset-background"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Location Filter */}
      <div className="space-y-2">
        <Label htmlFor="location" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Location
        </Label>
        <Input
          id="location"
          placeholder="e.g. Bangalore"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="h-9 text-xs"
        />
      </div>

      {/* Price Ranges */}
      <div className="space-y-3">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Daily Price (₹)
        </Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
          <div>
            <Input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="h-9 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Availability Status */}
      <div className="space-y-2">
        <Label htmlFor="status" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Availability
        </Label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as EquipmentStatus | "")}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs ring-offset-background"
        >
          <option value="">Any Status</option>
          <option value="AVAILABLE">Available</option>
          <option value="BOOKED">Booked</option>
          <option value="MAINTENANCE">Maintenance</option>
          <option value="UNAVAILABLE">Unavailable</option>
        </select>
      </div>
    </div>
  );
}
