import { Layout } from "@/components/layout/Layout";
import { HeartPulse, MapPin, ShieldCheck, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6"
          >
            <HeartPulse className="w-10 h-10" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-foreground mb-6">
            About PharmaFinder
          </h1>
          <p className="text-xl text-muted-foreground">
            Bridging the gap between patients and healthcare providers in Algeria. 
            We make finding medical help simple, fast, and reliable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-6">
              In moments of medical need, finding an open pharmacy or the right specialist shouldn't add to your stress. PharmaFinder was created to digitize and democratize access to healthcare information across all 58 wilayas of Algeria.
            </p>
            <p className="text-lg text-muted-foreground">
              Whether you need to find a "Pharmacie de Garde" at 2 AM or book a consultation with a cardiologist in your commune, our platform provides accurate, up-to-date information right at your fingertips.
            </p>
          </div>
          <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src={`${import.meta.env.BASE_URL}images/about-medical.png`} 
              alt="Clean clinic interior" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-border text-center shadow-sm">
            <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Nationwide Coverage</h3>
            <p className="text-muted-foreground">Comprehensive database covering all 58 Wilayas and major communes of Algeria.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-border text-center shadow-sm">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Real-time "Garde"</h3>
            <p className="text-muted-foreground">Up-to-date tracking of pharmacies on duty, ensuring you can find medication when it matters most.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-border text-center shadow-sm">
            <div className="w-14 h-14 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Verified Data</h3>
            <p className="text-muted-foreground">Information checked and verified to ensure you get accurate contact details and addresses.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
