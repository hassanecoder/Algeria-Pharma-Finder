import { Link } from "wouter";
import { HeartPulse, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-border pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-primary/10 p-2 rounded-xl text-primary">
                <HeartPulse className="w-6 h-6" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-foreground">
                Pharma<span className="text-primary">Finder</span>
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Your trusted platform to find on-duty pharmacies and specialized doctors across all 58 wilayas of Algeria.
            </p>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/pharmacies" className="text-muted-foreground hover:text-primary transition-colors">Find a Pharmacy</Link></li>
              <li><Link href="/doctors" className="text-muted-foreground hover:text-primary transition-colors">Find a Doctor</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg mb-4 text-foreground">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" /> Algiers, Algeria
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" /> +213 (0) 555 123 456
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" /> contact@pharmafinder.dz
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} PharmaFinder Algeria. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">Privacy Policy</span>
            <span className="text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
