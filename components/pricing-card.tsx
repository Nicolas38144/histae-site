import type { PricingCardModel } from "../lib/pricing";

type PricingCardProps = {
  plan: PricingCardModel;
  premiumBadge: string;
};

export function PricingCard({ plan, premiumBadge }: PricingCardProps) {
  return (
    <article className="pricing-card" data-featured={plan.featured}>
      <div className="pricing-card-heading">
        <h3>{plan.name}</h3>
        {plan.featured ? <span className="plan-badge">{premiumBadge}</span> : null}
      </div>
      <p className="plan-price">
        <strong>{plan.price}</strong>
        <span>{plan.period}</span>
      </p>
      <p className="plan-annual">{plan.annual}</p>
      {plan.trial ? <p className="plan-trial">{plan.trial}</p> : null}
      <p className="plan-description">{plan.description}</p>
      <ul>
        {plan.features.map((feature) => <li key={feature.id}>{feature.label}</li>)}
      </ul>
    </article>
  );
}
