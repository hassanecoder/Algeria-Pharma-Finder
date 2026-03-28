import { useRoute } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/Badge";
import { MapPin, Phone, Clock, Mail, ShieldCheck, CheckCircle2, Navigation } from "lucide-react";
import { useGetPharmacy } from "@workspace/api-client-react";

export default function PharmacyDetail() {
  const [, params] = useRoute("/pharmacies/:id");
  const id = params?.id ? parseInt(params.id) : 0;
  
  const { data: pharmacy, isLoading, isError } = useGetPharmacy(id, { query: { enabled: !!id } });

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
          <div className="h-12 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-muted rounded-2xl w-full mb-8"></div>
        </div>
      </Layout>
    );
  }

  if (isError || !pharmacy) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-foreground">Pharmacy not found</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header Banner */}
      <div className="bg-primary/5 border-b border-border py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="bg-white">{pharmacy.wilaya_name}</Badge>
              {pharmacy.on_duty && <Badge variant="success">Currently On Duty</Badge>}
              {pharmacy.is_24h && <Badge variant="secondary">24/7</Badge>}
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-extrabold text-foreground">{pharmacy.name}</h1>
            {pharmacy.name_ar && <h2 className="text-xl text-muted-foreground mt-1" dir="rtl">{pharmacy.name_ar}</h2>}
          </div>
          
          <div className="flex gap-3">
            <a href={`tel:${pharmacy.phone}`} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
              <Phone className="w-4 h-4" /> Call Now
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Info */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
              <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                <MapPin className="text-primary" /> Location & Contact
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-muted p-3 rounded-xl"><MapPin className="w-5 h-5 text-foreground" /></div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Address</p>
                    <p className="text-foreground font-medium">{pharmacy.address}</p>
                    {pharmacy.commune && <p className="text-foreground">{pharmacy.commune}, {pharmacy.wilaya_name}</p>}
                  </div>
                </div>
                
                {pharmacy.phone && (
                  <div className="flex items-start gap-4">
                    <div className="bg-muted p-3 rounded-xl"><Phone className="w-5 h-5 text-foreground" /></div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Phone</p>
                      <p className="text-foreground font-medium">{pharmacy.phone}</p>
                      {pharmacy.phone2 && <p className="text-foreground">{pharmacy.phone2}</p>}
                    </div>
                  </div>
                )}

                {pharmacy.email && (
                  <div className="flex items-start gap-4">
                    <div className="bg-muted p-3 rounded-xl"><Mail className="w-5 h-5 text-foreground" /></div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Email</p>
                      <p className="text-foreground font-medium">{pharmacy.email}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Map Placeholder */}
              <div className="mt-8 rounded-xl bg-muted h-64 flex flex-col items-center justify-center border border-border">
                <Navigation className="w-10 h-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground font-medium">Interactive Map view</p>
                <p className="text-xs text-muted-foreground">Coordinates: {pharmacy.latitude || "N/A"}, {pharmacy.longitude || "N/A"}</p>
              </div>
            </div>

            {pharmacy.services && pharmacy.services.length > 0 && (
              <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
                <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                  <ShieldCheck className="text-primary" /> Available Services
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pharmacy.services.map((service, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                      <span className="text-foreground">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar / Hours */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
              <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
                <Clock className="text-primary" /> Hours
              </h3>
              {pharmacy.is_24h ? (
                <div className="bg-success/10 text-success p-4 rounded-xl text-center font-semibold">
                  Open 24/7
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">Opening</span>
                    <span className="font-semibold text-foreground">{pharmacy.hours_open || '08:00'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Closing</span>
                    <span className="font-semibold text-foreground">{pharmacy.hours_close || '18:00'}</span>
                  </div>
                </div>
              )}

              {pharmacy.on_duty && (
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                    <h4 className="font-semibold text-primary mb-1 text-sm">Garde Status</h4>
                    <p className="text-sm text-foreground">
                      This pharmacy is currently on duty {pharmacy.on_duty_until && `until ${pharmacy.on_duty_until}`}.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
