import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SuggestForm from "@/components/SuggestForm";

export default function SuggestInterviewPage() {
  return (
    <div className="page-bg">
      <Nav />
      <div className="section" style={{ paddingTop: 40, paddingBottom: 56 }}>
        <p className="text-eyebrow" style={{ marginBottom: 10 }}>Into the Kitchen</p>
        <h1 className="text-h1" style={{ marginBottom: 8 }}>Suggest someone</h1>
        <p className="text-body text-muted" style={{ maxWidth: 480, marginBottom: 32, lineHeight: 1.75 }}>
          Know a chef, founder, or food person in Stavanger with a great story? Tell me who I should talk to.
        </p>
        <SuggestForm
          type="interview"
          nameLabel="Their name"
          locationLabel="Restaurant or business"
          locationPlaceholder="e.g. Toko Bintang, Sandnes"
          whyLabel="Why they'd make a great story"
          whyPlaceholder="What makes their story worth telling?"
          emailHint="optional — if you want to be kept in the loop"
          successMessage="Thanks for the tip! Looking forward to checking it out :)"
        />
      </div>
      <Footer />
    </div>
  );
}
