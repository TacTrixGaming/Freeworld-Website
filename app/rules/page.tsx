import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BookIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Server Rules"
};

export const dynamic = "force-dynamic";

export default async function RulesPage() {
  const categories = await prisma.ruleCategory.findMany({
    orderBy: { order: "asc" },
    include: {
      rules: {
        where: { enabled: true },
        orderBy: { order: "asc" }
      }
    }
  });

  return (
    <section className="section">
      <div className="container">
        <div className="page-hero compact">
          <span className="page-icon"><BookIcon /></span>
          <span className="eyebrow plain">Community standards</span>
          <h1>Server Rules</h1>
          <p>
            These rules protect fair play, serious roleplay, and a respectful
            community. Not knowing a rule does not exempt a player from it.
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="empty-state">
            <h2>No rules have been published yet.</h2>
            <p>Check back after the staff team finishes the rulebook.</p>
          </div>
        ) : (
          <div className="rules-layout">
            <aside className="rules-nav">
              <strong>Categories</strong>
              {categories.map((category: (typeof categories)[number]) => (
                <a href={`#${category.id}`} key={category.id}>
                  {category.title}
                </a>
              ))}
            </aside>

            <div className="rules-content">
              {categories.map((category: (typeof categories)[number]) => (
                <section className="rule-category" id={category.id} key={category.id}>
                  <div className="rule-category-header">
                    <h2>{category.title}</h2>
                    {category.description && <p>{category.description}</p>}
                  </div>
                  <div className="rule-list">
                    {category.rules.map((rule: (typeof category.rules)[number]) => (
                      <article className="rule-card" key={rule.id}>
                        <span className="rule-code">{rule.code}</span>
                        <div>
                          <h3>{rule.title}</h3>
                          <p>{rule.body}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
