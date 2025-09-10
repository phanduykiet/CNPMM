import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
};

const Card = ({ children }: CardProps) => (
  <div className="card p-3 mb-2">{children}</div>
);

export default Card;
