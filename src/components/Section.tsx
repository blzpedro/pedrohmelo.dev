import type { ReactNode } from "react";

/** Page section with the heading in a left column on wide screens. */
export function Section({
  id,
  title,
  children,
  aside,
}: {
  id: string;
  title: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="border-t border-line">
      <div className="container-page grid gap-8 py-20 sm:py-28 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <h2 id={`${id}-title`} className="text-2xl font-extrabold tracking-tight">
            {title}
          </h2>
          {aside}
        </div>
        <div className="lg:col-span-8">{children}</div>
      </div>
    </section>
  );
}
