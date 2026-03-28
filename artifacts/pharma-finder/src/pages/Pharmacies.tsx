import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { MapPin, Phone, Clock, Search, Filter, ShieldPlus } from "lucide-react";
import { useListPharmacies, useListWilayas } from "@workspace/api-client-react";

export default function Pharmacies() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [wilayaId, setWilayaId] = useState(searchParams.get("wilaya_id") || "");
  const [onDutyOnly, setOnDutyOnly] = useState(searchParams.get("on_duty") === "true");

  const { data: wilayas } = useListWilayas();
  
  const { data: response, isLoading, isError } = useListPharmacies({
    search: search || undefined,
    wilaya_id: wilayaId ? parseInt(wilayaId) : undefined,
    on_duty: onDutyOnly ? true : undefined,
    limit: 20
  });

  return (
    <Layout>
      <div className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold mb-4">Pharmacies Directory</h1>
          <p className="text-primary-foreground/80 max-w-2xl text-lg">
            Find pharmacies near you. Toggle 'On Duty' to find pharmacies open outside regular hours or during holidays.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-primary" />
                <h2 className="font-display font-bold text-lg">Filters</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Search Name</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="e.g. Pharmacie Centrale..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Wilaya</label>
                  <select
                    value={wilayaId}
                    onChange={(e) => setWilayaId(e.target.value)}
                    className="w-full p-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                  >
                    <option value="">All Wilayas</option>
                    {wilayas?.map(w => (
                      <option key={w.id} value={w.id}>{w.code} - {w.name}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 border-t border-border">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={onDutyOnly}
                        onChange={(e) => setOnDutyOnly(e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="w-10 h-6 bg-muted rounded-full peer-checked:bg-success transition-colors"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4 shadow-sm"></div>
                    </div>
                    <span className="text-sm font-medium text-foreground flex items-center gap-1.5 group-hover:text-success transition-colors">
                      <ShieldPlus className="w-4 h-4" /> On Duty (De Garde)
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-foreground">
                {isLoading ? "Searching..." : `${response?.total || 0} Pharmacies Found`}
              </h2>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-border animate-pulse">
                    <div className="h-6 bg-muted rounded w-2/3 mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-4/5"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <EmptyState title="Error" description="Failed to load pharmacies. Please try again." />
            ) : response?.data.length === 0 ? (
              <EmptyState 
                title="No pharmacies found" 
                description="Try adjusting your filters or search term to find what you're looking for." 
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {response?.data.map((pharmacy) => (
                  <Link key={pharmacy.id} href={`/pharmacies/${pharmacy.id}`} className="block group">
                    <div className="bg-white rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg hover:border-primary/40 transition-all duration-300 h-full flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                            {pharmacy.name}
                          </h3>
                          {pharmacy.name_ar && <p className="text-sm text-muted-foreground" dir="rtl">{pharmacy.name_ar}</p>}
                        </div>
                        {pharmacy.on_duty && (
                          <Badge variant="success" className="animate-pulse">De Garde</Badge>
                        )}
                      </div>
                      
                      <div className="space-y-3 mt-auto">
                        <div className="flex items-start gap-3 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span>{pharmacy.address}, {pharmacy.wilaya_name}</span>
                        </div>
                        {pharmacy.phone && (
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Phone className="w-4 h-4 text-primary shrink-0" />
                            <span>{pharmacy.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 text-primary shrink-0" />
                          <span>
                            {pharmacy.is_24h ? "Open 24/7" : `${pharmacy.hours_open || '08:00'} - ${pharmacy.hours_close || '18:00'}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
