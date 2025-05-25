import "./TransactionCard.css";

type Props = {
  icon: string;
  concept: string;
  date: string;
  amount: number;
};

const TransactionCard = ({ icon, concept, date, amount }: Props) => {
  return (
    <div className="transaction-card">
      <div className="transaction-card__icon">
        <i className={icon}></i>
      </div>
      <div className="transaction-card__content">
        <h4>{concept}</h4>
        <p>{date}</p>
      </div>
      <div className="transaction-card__amount">{Math.abs(amount)}€</div>
    </div>
  );
};

export default TransactionCard;
