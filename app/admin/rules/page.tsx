import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/permissions";
import {
  createRule,
  createRuleCategory,
  deleteRule,
  toggleRule
} from "@/app/actions/rules";

export const dynamic = "force-dynamic";

export default async function AdminRulesPage() {
  await requirePermission(PERMISSIONS.RULES_MANAGE);
  const categories = await prisma.ruleCategory.findMany({
    orderBy: { order: "asc" },
    include: { rules: { orderBy: { order: "asc" } } }
  });

  return (
    <>
      <div className="admin-heading">
        <div>
          <span className="eyebrow plain">Content management</span>
          <h1>Rules</h1>
          <p>Create categories, publish rules, or temporarily hide them.</p>
        </div>
      </div>

      <div className="review-grid">
        <div className="admin-panel">
          <div className="panel-heading"><div><h2>Published structure</h2><p>Rules appear publicly in this order.</p></div></div>
          <div className="admin-rule-list">
            {categories.map((category: (typeof categories)[number]) => (
              <section key={category.id}>
                <h3>{category.title}</h3>
                {category.rules.map((rule: (typeof category.rules)[number]) => (
                  <div className="admin-rule-row" key={rule.id}>
                    <div>
                      <strong>{rule.code} · {rule.title}</strong>
                      <span>{rule.body}</span>
                    </div>
                    <div className="row-actions">
                      <form action={toggleRule}>
                        <input type="hidden" name="id" value={rule.id} />
                        <input type="hidden" name="enabled" value={String(!rule.enabled)} />
                        <button className="text-button" type="submit">
                          {rule.enabled ? "Hide" : "Publish"}
                        </button>
                      </form>
                      <form action={deleteRule}>
                        <input type="hidden" name="id" value={rule.id} />
                        <button className="text-button danger" type="submit">Delete</button>
                      </form>
                    </div>
                  </div>
                ))}
              </section>
            ))}
          </div>
        </div>

        <div className="stacked-panels">
          <div className="admin-panel">
            <div className="panel-heading"><div><h2>Add category</h2></div></div>
            <form action={createRuleCategory} className="form-stack">
              <div className="form-group"><label htmlFor="category-title">Title</label><input id="category-title" name="title" required /></div>
              <div className="form-group"><label htmlFor="category-description">Description</label><textarea id="category-description" name="description" rows={3} /></div>
              <div className="form-group"><label htmlFor="category-order">Order</label><input id="category-order" name="order" type="number" defaultValue={0} /></div>
              <button className="button button-small" type="submit">Create category</button>
            </form>
          </div>

          <div className="admin-panel">
            <div className="panel-heading"><div><h2>Add rule</h2></div></div>
            <form action={createRule} className="form-stack">
              <div className="form-group"><label htmlFor="categoryId">Category</label><select id="categoryId" name="categoryId" required><option value="">Choose category</option>{categories.map((category: (typeof categories)[number]) => <option value={category.id} key={category.id}>{category.title}</option>)}</select></div>
              <div className="form-grid">
                <div className="form-group"><label htmlFor="code">Code</label><input id="code" name="code" placeholder="2.5" required /></div>
                <div className="form-group"><label htmlFor="order">Order</label><input id="order" name="order" type="number" defaultValue={0} /></div>
              </div>
              <div className="form-group"><label htmlFor="title">Title</label><input id="title" name="title" required /></div>
              <div className="form-group"><label htmlFor="body">Rule text</label><textarea id="body" name="body" rows={5} required /></div>
              <button className="button button-small" type="submit">Publish rule</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
