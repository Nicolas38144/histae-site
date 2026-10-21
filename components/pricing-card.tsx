import type { PricingCardModel } from "../lib/pricing";

type PricingCardProps = {
  plan: PricingCardModel;
  compact?: boolean;
};

export function PricingCard({ plan, compact = false }: PricingCardProps) {
  return (
    <article className="pricing-card" data-featured={plan.featured} aria-labelledby={`plan-${plan.id}`}>
      <div className="pricing-card-heading">
        <h3 id={`plan-${plan.id}`}>{plan.name}</h3>
        {plan.badge ? <span className="plan-badge">{plan.badge}</span> : null}
      </div>
      <p className="plan-price">
        <strong>{plan.price}</strong>
        <span>{plan.period}</span>
      </p>
      <p className="plan-billing">{plan.billing}</p>
      {plan.equivalent ? <p className="plan-equivalent">{plan.equivalent}</p> : null}
      {plan.saving ? <p className="plan-saving">{plan.saving}</p> : null}
      <p className="plan-description">{plan.description}</p>
      {compact ? null : <ul>
        {plan.features.map((feature) => <li key={feature.id}>{feature.label}</li>)}
      </ul>}
    </article>
  );
}
