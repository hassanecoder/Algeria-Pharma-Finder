import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Search, MapPin, Stethoscope, Pill, ArrowRight, ShieldCheck, Clock, UserCheck } from "lucide-react";
import { useListWilayas, useListPharmacies, useListDoctors } from "@workspace/api-client-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchType, setSearchType] = useState<"pharmacy" | "doctor">("pharmacy");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWilaya, setSelectedWilaya] = useState("");

  const { data: wilayas } = useListWilayas();
  // Fetch some stats (in a real app these might be separate endpoints, here we just use list endpoints to get totals)
  const { data: pharmData } = useListPharmacies({ limit: 1 });
  const { data: docData } = useListDoctors({ limit: 1 });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedWilaya) params.set("wilaya_id", selectedWilaya);
    
    if (searchType === "pharmacy") {
      setLocation(`/pharmacies?${params.toString()}`);
    } else {
      setLocation(`/doctors?${params.toString()}`);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 -z-10 w-full h-full bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute top-20 right-10 -z-10 w-96 h-96 bg-secondary/30 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-10 left-10 -z-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-50" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6">
                <ShieldCheck className="w-4 h-4" />
                <span>Trusted Healthcare Network in Algeria</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-display font-extrabold text-foreground leading-tight mb-6">
                Find the right <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">
                  care, right now.
                </span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Locate on-duty pharmacies and specialized doctors across all 58 wilayas instantly. Your health, simplified.
              </p>

              {/* Search Box */}
              <div className="bg-white p-3 rounded-2xl shadow-xl shadow-black/5 border border-border">
                <div className="flex gap-2 mb-3 px-2 pt-2">
                  <button
                    onClick={() => setSearchType("pharmacy")}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                      searchType === "pharmacy" ? "bg-primary text-white shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    <Pill className="w-4 h-4 inline-block mr-2" />
                    Pharmacies
                  </button>
                  <button
                    onClick={() => setSearchType("doctor")}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                      searchType === "doctor" ? "bg-primary text-white shadow-md" : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    <Stethoscope className="w-4 h-4 inline-block mr-2" />
                    Doctors
                  </button>
                </div>
                
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder={searchType === "pharmacy" ? "Search pharmacy name..." : "Search doctor, specialty..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl outline-none transition-all"
                    />
                  </div>
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <select
                      value={selectedWilaya}
                      onChange={(e) => setSelectedWilaya(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="">All Wilayas</option>
                      {wilayas?.map(w => (
                        <option key={w.id} value={w.id}>{w.code} - {w.name}</option>
                      ))}
                    </select>
                  </div>
                  <button 
                    type="submit"
                    className="bg-foreground text-white px-8 py-3 rounded-xl font-semibold hover:bg-foreground/90 transition-all shadow-lg active:scale-95"
                  >
                    Search
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-[3rem] -rotate-6 transform scale-105" />
              <img 
                src={`${import.meta.env.BASE_URL}images/hero-medical.png`} 
                alt="Medical Professional Background" 
                className="relative z-10 w-full h-auto rounded-[3rem] shadow-2xl object-cover"
              />
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-border z-20 flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="w-12 h-12 bg-success/15 rounded-full flex items-center justify-center text-success">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Pharmacies de Garde</p>
                  <p className="font-bold text-foreground">Updated Daily</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="p-4">
              <h3 className="text-4xl font-display font-extrabold text-primary mb-2">
                {pharmData?.total ? `${(pharmData.total / 1000).toFixed(1)}k+` : "12k+"}
              </h3>
              <p className="text-muted-foreground font-medium">Registered Pharmacies</p>
            </div>
            <div className="p-4">
              <h3 className="text-4xl font-display font-extrabold text-primary mb-2">
                {docData?.total ? `${(docData.total / 1000).toFixed(1)}k+` : "8k+"}
              </h3>
              <p className="text-muted-foreground font-medium">Verified Doctors</p>
            </div>
            <div className="p-4">
              <h3 className="text-4xl font-display font-extrabold text-primary mb-2">58</h3>
              <p className="text-muted-foreground font-medium">Covered Wilayas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">How can we help you today?</h2>
            <p className="text-muted-foreground">Access our comprehensive directory of healthcare professionals and facilities across the country.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/pharmacies" className="group block">
              <div className="bg-white rounded-3xl p-8 border border-border shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
                <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Pill className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-3 text-foreground group-hover:text-primary transition-colors">Find a Pharmacy</h3>
                <p className="text-muted-foreground mb-6 line-clamp-2">
                  Locate the nearest pharmacy, check their opening hours, and instantly see which ones are currently on duty (de garde).
                </p>
                <span className="inline-flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
                  Browse Pharmacies <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </div>
            </Link>

            <Link href="/doctors" className="group block">
              <div className="bg-white rounded-3xl p-8 border border-border shadow-sm hover:shadow-xl hover:border-secondary/50 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
                <div className="w-14 h-14 bg-secondary/30 text-secondary-foreground rounded-2xl flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                  <UserCheck className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-3 text-foreground group-hover:text-secondary-foreground transition-colors">Find a Doctor</h3>
                <p className="text-muted-foreground mb-6 line-clamp-2">
                  Search for doctors by specialty, check their consultation hours, fees, and whether they accept CNAS/CASNOS.
                </p>
                <span className="inline-flex items-center text-secondary-foreground font-semibold group-hover:gap-2 transition-all">
                  Browse Doctors <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
