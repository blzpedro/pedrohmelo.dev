import type { DemoKind } from "@/content";
import { GridDemo } from "./GridDemo";
import { MovioDemo } from "./MovioDemo";
import { ShopDemo } from "./ShopDemo";

export function Demo({ kind }: { kind: DemoKind }) {
  switch (kind) {
    case "grid":
      return <GridDemo />;
    case "shop":
      return <ShopDemo />;
    case "movio":
      return <MovioDemo />;
  }
}
