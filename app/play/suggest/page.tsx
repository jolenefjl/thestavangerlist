import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SuggestForm from "@/components/SuggestForm";

export default function SuggestPlayPage() {
  return (
    <div className="page-bg">
      <Nav />
      <div className="section" style={{ paddingTop: 40, paddingBottom: 56 }}>
        <p className="text-eyebrow" style={{ marginBottom: 10 }}>Stavanger Play</p>
        <h1 className="text-h1" style={{ marginBottom: 28 }}>Suggest a place</h1>
        <SuggestForm
          type="experience"
          nameLabel="Experience or place name"
          locationLabel="Location"
          locationPlaceholder="e.g. Stavanger Sentrum, Sandnes"
          whyLabel="Why you recommend it"
          successMessage="Thanks for the suggestion — I'll check it out."
        />
      </div>
      <Footer />
    </div>
  );
}
