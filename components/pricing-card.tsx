import Link from "next/link";
import type { PricingCardModel } from "../lib/pricing";

type PricingCardProps = {
  plan: PricingCardModel;
  compact?: boolean;
  action?: { href: string; label: string };
};

export function PricingCard({ plan, compact = false, action }: PricingCardProps) {
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
      {!compact && (
        <ul>
          {plan.features.map((feature) => <li key={feature.id}>{feature.label}</li>)}
        </ul>
      )}
      {action && (
        <div className="pricing-card-action">
          <Link className="button button-primary" href={action.href}>
            {action.label}
          </Link>
        </div>
      )}
    </article>
  );
}
