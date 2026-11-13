import { expect, test, type Page } from "@playwright/test";

/** `git log` order with what `git checkout` targets: main job, side project, then past roles. */
const log = [
  ["electrolux", "main"],
  ["movio", "side/movio"],
  ["linked-gourmet", "linked-gourmet"],
  ["mobilize", "mobilize"],
  ["bmw", "bmw"],
  ["performa", "performa"],
  ["modalgr", "modalgr"],
  ["alleasy", "alleasy"],
] as const;

/** Scrolls the terminal so a role's first line sits in the band that decides the checked-out role. */
async function readRole(page: Page, id: string) {
  await page.evaluate((company) => {
    const scroller = document.querySelector<HTMLElement>("[data-testid=terminal] [role=region]")!;
    const item = scroller.querySelector<HTMLElement>(`[data-company="${company}"]`)!;
    const offset = item.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
    scroller.scrollTop += offset - scroller.clientHeight * 0.18;
  }, id);
}

test.describe("language", () => {
  test.describe("English browser", () => {
    test.use({ locale: "en-US" });
    test("root redirects to /en", async ({ page }) => {
      await page.goto("/");
      await expect(page).toHaveURL(/\/en$/);
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
    });
  });

  test.describe("Portuguese browser", () => {
    test.use({ locale: "pt-BR" });
    test("root redirects to /pt", async ({ page }) => {
      await page.goto("/");
      await expect(page).toHaveURL(/\/pt$/);
      await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
      await expect(page.getByText("Construo produtos de ponta a ponta", { exact: false })).toBeVisible();
    });
  });

  test("switching language keeps the reader's section", async ({ page }) => {
    await page.goto("/en");
    await page.evaluate(() =>
      document.getElementById("skills")!.scrollIntoView({ behavior: "instant" }),
    );
    await expect(page.getByRole("heading", { name: "Skills" })).toBeInViewport();
    // A real click; Playwright's own click would first scroll the sticky header link.
    await page.getByRole("link", { name: "Português" }).dispatchEvent("click");
    await expect(page).toHaveURL(/\/pt#skills$/);
    await expect(page.getByRole("heading", { name: "Habilidades" })).toBeInViewport();
    const cookies = await page.context().cookies();
    expect(cookies.find((c) => c.name === "NEXT_LOCALE")?.value).toBe("pt");
  });

  test("unknown pages show the localized 404", async ({ page }) => {
    const response = await page.goto("/pt/nao-existe");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Esta página não existe" })).toBeVisible();
  });
});

test("leads with the fullstack role and São Paulo", async ({ page }) => {
  await page.goto("/pt");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Desenvolvedor\s*Fullstack/);
  await expect(page.locator("#top")).toContainText("São Paulo, Brasil");
  await expect(page.locator("#top")).not.toContainText("Santos");
  await expect(page.locator("#top")).toContainText("BMW, Electrolux e Renault");
});

test("theme toggle switches and remembers the theme", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("html")).toHaveClass(/\bdark\b/);
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(page.locator("html")).toHaveClass(/\blight\b/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/\blight\b/);
  await expect(page.getByRole("button", { name: "Switch to dark theme" })).toBeVisible();
});

test.describe("experience as git log", () => {
  test("checks out each role as it is read, newest first", async ({ page }) => {
    await page.goto("/en");
    await page.waitForLoadState("networkidle");
    await page.getByTestId("terminal").scrollIntoViewIfNeeded();
    const prompt = page.getByTestId("git-prompt");

    for (const [i, [company, checkout]] of log.entries()) {
      await readRole(page, company);
      await expect(page.locator("[data-active]")).toHaveAttribute("data-company", company);
      await expect(prompt).toContainText(`git checkout ${checkout}`);
      await expect(prompt).toContainText(`${i + 1}/${log.length}`);
      // The prompt is the terminal's last line, so it stays on screen while the log scrolls.
      await expect(prompt).toBeInViewport();
    }
  });

  test("scrolling to the bottom of the terminal checks out the first job", async ({ page }) => {
    await page.goto("/en");
    await page.waitForLoadState("networkidle");
    const scroller = page.getByTestId("terminal").getByRole("region");
    await scroller.scrollIntoViewIfNeeded();
    const box = (await scroller.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    for (let i = 0; i < 60; i++) await page.mouse.wheel(0, 200);
    await expect(page.locator("[data-active]")).toHaveAttribute("data-company", "alleasy");
    await expect(page.getByTestId("git-prompt")).toContainText("git checkout alleasy");
    await expect(page.getByTestId("git-prompt")).toContainText("8/8");
  });

  test("shows a company mark for every role", async ({ page }) => {
    await page.goto("/en");
    const terminal = page.getByTestId("terminal");
    await expect(terminal.getByTestId("company-mark")).toHaveCount(8);
    // Every role uses its real logo, drawn as a mask.
    await expect(terminal.locator("[data-testid=company-mark] > span[style*='mask']")).toHaveCount(8);
    for (const logo of [
      "electrolux.svg",
      "movio.png",
      "linked.png",
      "renault.svg",
      "bmw.svg",
      "performa.png",
      "modalgr.png",
      "alleasy.png",
    ]) {
      const response = await page.request.get(`/logos/${logo}`);
      expect(response.ok(), logo).toBe(true);
    }
  });

  test("marks the roles at global companies", async ({ page }) => {
    await page.goto("/en");
    for (const company of ["electrolux", "mobilize", "bmw"]) {
      await expect(page.locator(`[data-company="${company}"] [data-testid=scope]`)).toContainText("Global");
    }
    await expect(page.locator("[data-testid=scope]")).toHaveCount(3);
  });

  test("puts the main job on HEAD and the side project on its own branch", async ({ page }) => {
    await page.goto("/pt");
    const electrolux = page.locator('[data-company="electrolux"]');
    const movio = page.locator('[data-company="movio"]');
    await expect(electrolux).toContainText("HEAD -> main");
    await expect(electrolux).toContainText("Atual");
    await expect(movio).toContainText("side/movio");
    await expect(movio).toContainText("projeto paralelo");
    await expect(page.locator('[data-company="bmw"]')).toContainText("Desenvolvedor Fullstack, Lisboa");
  });

  test("keeps the terminal dark in the light theme", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("button", { name: "Switch to light theme" }).click();
    await expect(page.locator("html")).toHaveClass(/\blight\b/);
    await expect(page.getByTestId("terminal")).toHaveCSS(
      "background-color",
      "rgb(9, 19, 31)",
    );
  });

  test.describe("with reduced motion", () => {
    test.use({ reducedMotion: "reduce" });
    test("prints the command without the typing animation", async ({ page }) => {
      await page.goto("/en");
      const typed = page.getByTestId("git-prompt").locator(".typed");
      await expect(typed).toHaveCSS("animation-name", "none");
    });
  });
});

test("the page ends at the footer", async ({ page }) => {
  await page.goto("/en");
  await page.waitForLoadState("networkidle");
  const gap = await page.evaluate(() => {
    const footer = document.querySelector("footer")!.getBoundingClientRect();
    return document.documentElement.scrollHeight - (footer.bottom + window.scrollY);
  });
  expect(Math.abs(gap)).toBeLessThan(2);
});

test("every skill shows its icon", async ({ page }) => {
  await page.goto("/en");
  const items = page.locator("#skills li");
  const count = await items.count();
  expect(count).toBeGreaterThan(40);
  await expect(page.locator("#skills li:not(:has(svg))")).toHaveCount(0);
});

test.describe("case studies", () => {
  test("the home page lists the three projects first", async ({ page }) => {
    await page.goto("/en");
    const cards = page.getByTestId("project-card");
    await expect(cards).toHaveCount(3);
    await expect(cards.first()).toHaveAttribute("href", "/en/projects/bmw-digital-shop");
    await expect(cards.first()).toHaveAttribute("data-featured", "true");
    const order = await page.evaluate(() => [...document.querySelectorAll("main > section[id]")].map((s) => s.id));
    expect(order.slice(0, 2)).toEqual(["top", "projects"]);
  });

  test("Electrolux: edits are saved as one batch", async ({ page }) => {
    await page.goto("/en/projects/electrolux-cost-grid");
    const demo = page.getByTestId("grid-demo");
    await demo.getByRole("textbox", { name: "Copper, Feb" }).fill("8,700.0");
    await demo.getByRole("textbox", { name: "Freight, Apr" }).fill("101.3");
    await expect(page.getByTestId("grid-status")).toHaveText("2 pending changes");
    await demo.getByRole("button", { name: "Save batch" }).click();
    await expect(page.getByTestId("grid-status")).toHaveText("Saved 2 changes in one request");
  });

  test("BMW: the VIN picks the vehicle and only parts that fit can be added", async ({ page }) => {
    await page.goto("/en/projects/bmw-digital-shop");
    const demo = page.getByTestId("shop-demo");

    // The VIN is entered in a dialog; a malformed one is rejected before any lookup.
    await demo.getByRole("button", { name: "Add vehicle by VIN" }).click();
    const dialog = page.getByRole("dialog", { name: "Find your vehicle" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("textbox", { name: "VIN" }).fill("WB10J5300PZ55123O");
    await dialog.getByRole("button", { name: "Find vehicle" }).click();
    await expect(page.getByTestId("vin-status")).toContainText("never uses I, O or Q");

    // A valid one shows the model with its picture before it is confirmed.
    await dialog.getByRole("button", { name: /R 1250 GS/ }).click();
    const preview = page.getByTestId("vehicle-preview");
    await expect(preview).toContainText("BMW Motorrad R 1250 GS");
    await expect(preview.getByRole("img", { name: "BMW Motorrad R 1250 GS" })).toBeVisible();
    await expect(preview).toContainText("Cjp24");
    await preview.getByRole("button", { name: "Use this vehicle" }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByTestId("vehicle-name")).toHaveText("BMW Motorrad R 1250 GS, 2023");
    await expect(demo).toHaveAttribute("data-brand", "motorrad");

    const seat = demo.locator("[data-sku=mrd-seat]");
    const chain = demo.locator("[data-sku=mrd-chain]");
    await expect(seat).toContainText("Fits your R 1250 GS");
    await expect(chain.getByRole("button", { name: "Add to cart" })).toBeDisabled();
    await seat.getByRole("button", { name: "Add to cart" }).click();
    await expect(page.getByTestId("api-log")).toContainText("/vehicles/WB10J5300PZ551234");
  });

  test("BMW: the CSV importer stops bad files and ships good ones to the shop", async ({ page }) => {
    await page.goto("/en/projects/bmw-digital-shop");
    const pipeline = page.getByTestId("import-pipeline");
    await pipeline.scrollIntoViewIfNeeded();

    await pipeline.getByRole("button", { name: "Import" }).click();
    await expect(page.getByTestId("import-status")).toHaveText("12 products imported and on screen in the shop.", { timeout: 15000 });
    await expect(pipeline.locator("[data-node=csr]")).toHaveAttribute("data-status", "done");

    await pipeline.getByRole("radio", { name: /gear-filters\.csv/ }).click();
    await pipeline.getByRole("button", { name: "Import" }).click();
    await expect(page.getByTestId("import-status")).toContainText('Row 5 has an empty "category"', { timeout: 15000 });
    await expect(pipeline.locator("[data-node=decision]")).toHaveAttribute("data-status", "failed");
    await expect(pipeline.locator("[data-node=commercetools]")).toHaveAttribute("data-status", "idle");
    await expect(page.getByTestId("import-log")).toContainText("✗ row 5");
  });

  test("BMW: Motorrad gear with sizes, and a cart that follows the market", async ({ page }) => {
    await page.goto("/en/projects/bmw-digital-shop");
    const demo = page.getByTestId("shop-demo");
    await expect(demo).toContainText("Gear and garment");

    const jacket = demo.locator("[data-sku=mrd-jacket]");
    await expect(jacket).toContainText("-40%");
    await jacket.getByRole("combobox").selectOption("L");
    await jacket.getByRole("button", { name: "Add to cart" }).click();
    await jacket.getByRole("button", { name: "Add to cart" }).click();
    await expect(page.getByTestId("cart")).toContainText("Size L");
    await expect(page.getByTestId("cart-badge")).toHaveText("2");
    await expect(page.getByTestId("cart-total")).toHaveText("1.411,20 €");

    await demo.getByRole("combobox", { name: "Market" }).selectOption("US");
    await expect(page.getByTestId("cart-total")).toHaveText("$1,524.10");

    await demo.getByRole("button", { name: "Check out" }).click();
    await expect(page.getByTestId("cart-message")).toContainText(/Order BMW-MRD-\d+ placed/);
    await expect(page.getByTestId("api-log")).toContainText("/orders");
  });

  test("Movio: a feature goes from spec to the courier app", async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto("/en/projects/movio-courier-app");
    const demo = page.getByTestId("movio-demo");
    await demo.scrollIntoViewIfNeeded();

    // Before the update, a delivery finishes without proof.
    await expect(page.getByTestId("offer-card")).toBeVisible({ timeout: 6000 });
    await demo.getByRole("button", { name: "Accept" }).click();
    await demo.getByRole("button", { name: "Picked up the order" }).click();
    await demo.getByRole("button", { name: "Arrived at the customer" }).click();
    await expect(page.getByTestId("delivery-done")).toContainText("No proof of delivery in this version");

    // Spec, plan, tasks, PR checks, OTA.
    for (let i = 0; i < 3; i++) await demo.getByRole("button", { name: "Next step" }).click();
    await demo.getByRole("button", { name: "Run checks" }).click();
    await expect(demo.getByText("Ready to merge")).toBeVisible({ timeout: 6000 });
    await demo.getByRole("button", { name: "Next step" }).click();
    await demo.getByRole("button", { name: "Publish update" }).click();
    await expect(page.getByTestId("sdd-result")).toBeVisible({ timeout: 6000 });
    await expect(page.getByTestId("app-version")).toHaveText("v1.3.15");

    // After it, the next delivery asks for a photo and the customer's code.
    await demo.getByRole("button", { name: "Next offer" }).click();
    await expect(page.getByTestId("offer-card")).toBeVisible({ timeout: 6000 });
    await demo.getByRole("button", { name: "Accept" }).click();
    await demo.getByRole("button", { name: "Picked up the order" }).click();
    await demo.getByRole("button", { name: "Arrived at the customer" }).click();
    const proof = page.getByTestId("proof-screen");
    await proof.getByRole("button", { name: "Take a photo" }).click();
    await proof.getByRole("textbox").fill("0000");
    await proof.getByRole("button", { name: "Finish delivery" }).click();
    await expect(page.getByTestId("proof-error")).toHaveText("Wrong code. The delivery stays open.");

    const hint = await proof.getByText(/customer's code is/).textContent();
    await proof.getByRole("textbox").fill(hint!.match(/\d{4}/)![0]);
    await proof.getByRole("button", { name: "Finish delivery" }).click();
    await expect(page.getByTestId("delivery-done")).toContainText("Proof recorded: photo and code.");
    await expect(page.getByTestId("app-log")).toContainText("200 delivered");
  });

  test("switching language keeps the same case study", async ({ page }) => {
    await page.goto("/pt/projects/bmw-digital-shop");
    await page.getByRole("link", { name: "English" }).dispatchEvent("click");
    await expect(page).toHaveURL(/\/en\/projects\/bmw-digital-shop$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("The cart and the BMW Motorrad launch on BMW Group's shop");
  });

  test("unknown case studies are 404", async ({ page }) => {
    const response = await page.goto("/en/projects/nope");
    expect(response?.status()).toBe(404);
  });
});
