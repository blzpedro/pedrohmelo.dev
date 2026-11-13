import { getCurrentYear } from "@/lib/years";

export async function Footer() {
  const year = await getCurrentYear();

  return (
    <footer className="border-t border-line">
      <div className="container-page py-8 text-sm text-muted">
        <p>© {year} Pedro Melo</p>
      </div>
    </footer>
  );
}
