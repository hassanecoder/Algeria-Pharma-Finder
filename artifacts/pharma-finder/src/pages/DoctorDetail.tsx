import { useRoute } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/Badge";
import { MapPin, Phone, Clock, Mail, Stethoscope, Star, FileText, Globe, GraduationCap, Banknote } from "lucide-react";
import { useGetDoctor } from "@workspace/api-client-react";

export default function DoctorDetail() {
  const [, params] = useRoute("/doctors/:id");
  const id = params?.id ? parseInt(params.id) : 0;
  
  const { data: doctor, isLoading, isError } = useGetDoctor(id, { query: { enabled: !!id } });

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
          <div className="flex gap-6">
            <div className="w-32 h-32 bg-muted rounded-full shrink-0"></div>
            <div className="w-full">
              <div className="h-10 bg-muted rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/4 mb-8"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (isError || !doctor) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-foreground">Doctor not found</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Profile Header */}
      <div className="bg-white border-b border-border py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8 items-start">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-secondary/10 border-4 border-white shadow-xl rounded-full flex items-center justify-center shrink-0 overflow-hidden text-secondary">
            {doctor.image_url ? (
              <img src={doctor.image_url} alt={doctor.last_name} className="w-full h-full object-cover" />
            ) : (
              <Stethoscope className="w-16 h-16" />
            )}
          </div>
          
          <div className="flex-grow">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="accent">{doctor.specialty}</Badge>
              {doctor.available_today && <Badge variant="success">Available Today</Badge>}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-1">
              {doctor.title || "Dr."} {doctor.first_name} {doctor.last_name}
            </h1>
            
            {doctor.specialty_ar && <p className="text-lg text-muted-foreground" dir="rtl">{doctor.specialty_ar}</p>}
            
            <div className="flex items-center gap-6 mt-4 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-foreground">{doctor.rating || 'New'}</span>
                <span>({doctor.review_count || 0} reviews)</span>
              </div>
              {doctor.experience_years && (
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <span>{doctor.experience_years} Years Experience</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            
            {doctor.bio && (
              <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
                <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                  <FileText className="text-primary" /> About
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {doctor.bio}
                </p>
              </div>
            )}

            <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
              <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                <MapPin className="text-primary" /> Location
              </h3>
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-muted p-3 rounded-xl"><MapPin className="w-5 h-5 text-foreground" /></div>
                <div>
                  <p className="text-foreground font-medium text-lg">{doctor.address}</p>
                  <p className="text-muted-foreground">{doctor.commune}, {doctor.wilaya_name}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {doctor.languages && doctor.languages.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
                  <h4 className="font-display font-bold mb-3 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" /> Languages
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {doctor.languages.map(lang => (
                      <span key={lang} className="px-3 py-1 bg-muted rounded-lg text-sm text-foreground">{lang}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
                <h4 className="font-display font-bold mb-3 flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-primary" /> Consultation Info
                </h4>
                {doctor.consultation_fee && (
                  <p className="text-foreground font-medium mb-2">Fee: {doctor.consultation_fee} DZD</p>
                )}
                <div className="flex gap-2">
                  {doctor.accepts_cnas && <Badge variant="outline">CNAS Accepted</Badge>}
                  {doctor.accepts_casnos && <Badge variant="outline">CASNOS Accepted</Badge>}
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            
            <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
              <h3 className="text-lg font-display font-bold mb-4">Contact Cabinet</h3>
              
              {doctor.phone && (
                <a href={`tel:${doctor.phone}`} className="flex w-full items-center justify-center gap-2 bg-primary text-white px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all mb-4">
                  <Phone className="w-5 h-5" /> {doctor.phone}
                </a>
              )}
              
              {doctor.phone2 && (
                <div className="flex items-center gap-3 py-3 border-t border-border">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{doctor.phone2}</span>
                </div>
              )}
              
              {doctor.email && (
                <div className="flex items-center gap-3 py-3 border-t border-border">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{doctor.email}</span>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
              <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
                <Clock className="text-primary" /> Schedule
              </h3>
              <p className="text-muted-foreground whitespace-pre-line">
                {doctor.consultation_hours || "Contact the cabinet directly to book an appointment and verify working hours."}
              </p>
            </div>

          </div>

        </div>
      </div>
    </Layout>
  );
}
