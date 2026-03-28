import { useState } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { MapPin, Search, Filter, Stethoscope, Star } from "lucide-react";
import { useListDoctors, useListWilayas, useListSpecialties } from "@workspace/api-client-react";

export default function Doctors() {
  const searchParams = new URLSearchParams(window.location.search);
  
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [wilayaId, setWilayaId] = useState(searchParams.get("wilaya_id") || "");
  const [specialty, setSpecialty] = useState(searchParams.get("specialty") || "");

  const { data: wilayas } = useListWilayas();
  const { data: specialties } = useListSpecialties();
  
  const { data: response, isLoading, isError } = useListDoctors({
    search: search || undefined,
    wilaya_id: wilayaId ? parseInt(wilayaId) : undefined,
    specialty: specialty || undefined,
    limit: 20
  });

  return (
    <Layout>
      <div className="bg-secondary/30 text-secondary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold mb-4 text-foreground">Find a Doctor</h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Search for specialists, general practitioners, and surgeons. Book your next consultation easily.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-secondary-foreground" />
                <h2 className="font-display font-bold text-lg text-foreground">Filters</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Search Name</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="e.g. Dr. Benali..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-secondary-foreground focus:ring-2 focus:ring-secondary/50 transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Specialty</label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full p-2 bg-background border border-border rounded-lg focus:outline-none focus:border-secondary-foreground focus:ring-2 focus:ring-secondary/50 transition-all text-sm"
                  >
                    <option value="">All Specialties</option>
                    {specialties?.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Wilaya</label>
                  <select
                    value={wilayaId}
                    onChange={(e) => setWilayaId(e.target.value)}
                    className="w-full p-2 bg-background border border-border rounded-lg focus:outline-none focus:border-secondary-foreground focus:ring-2 focus:ring-secondary/50 transition-all text-sm"
                  >
                    <option value="">All Wilayas</option>
                    {wilayas?.map(w => (
                      <option key={w.id} value={w.id}>{w.code} - {w.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-foreground">
                {isLoading ? "Searching..." : `${response?.total || 0} Doctors Found`}
              </h2>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-border animate-pulse flex gap-4">
                    <div className="w-20 h-20 bg-muted rounded-full shrink-0"></div>
                    <div className="w-full space-y-3">
                      <div className="h-6 bg-muted rounded w-2/3"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                      <div className="h-4 bg-muted rounded w-full mt-4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <EmptyState title="Error" description="Failed to load doctors. Please try again." />
            ) : response?.data.length === 0 ? (
              <EmptyState 
                title="No doctors found" 
                description="Try adjusting your filters or search term to find what you're looking for." 
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {response?.data.map((doctor) => (
                  <Link key={doctor.id} href={`/doctors/${doctor.id}`} className="block group">
                    <div className="bg-white rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg hover:border-secondary/50 transition-all duration-300 h-full flex flex-col">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center text-secondary-foreground shrink-0 overflow-hidden">
                          {doctor.image_url ? (
                            <img src={doctor.image_url} alt={doctor.last_name} className="w-full h-full object-cover" />
                          ) : (
                            <Stethoscope className="w-8 h-8" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-lg text-foreground group-hover:text-secondary-foreground transition-colors">
                            {doctor.title || "Dr."} {doctor.first_name} {doctor.last_name}
                          </h3>
                          <p className="text-primary font-medium text-sm">{doctor.specialty}</p>
                          <div className="flex items-center gap-1 mt-1 text-sm">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-foreground">{doctor.rating || 'New'}</span>
                            {doctor.review_count ? <span className="text-muted-foreground">({doctor.review_count} reviews)</span> : null}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mt-auto pt-4 border-t border-border/50">
                        <div className="flex items-start gap-3 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{doctor.address}, {doctor.wilaya_name}</span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          {doctor.accepts_cnas && <Badge variant="outline" className="text-[10px]">CNAS</Badge>}
                          {doctor.accepts_casnos && <Badge variant="outline" className="text-[10px]">CASNOS</Badge>}
                          {doctor.available_today && <Badge variant="success" className="text-[10px]">Available Today</Badge>}
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
