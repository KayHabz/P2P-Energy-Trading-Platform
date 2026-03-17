import { buyNodeRed } from "../node_red/index";

const Card = ({ request, completeHandler }) => {
  const handlePurchase = async () => {
    await completeHandler(request.id, request.price);
    await buyNodeRed(request.amount * 100);
  };

  // Format values without ethers
  const energyAmount = request.amount.toString();
  const priceStr = request.price.toString();
  const priceEth = priceStr.slice(0, -18) || "0";
  const sellerAddress = `${request.creator.slice(0, 6)}...${request.creator.slice(-4)}`;

  // Status configuration
  const statusConfig = {
    "0": { 
      label: "Completed", 
      badgeClass: "energy-card__badge--completed",
      buttonClass: "energy-card__button--completed",
      disabled: true
    },
    "1": { 
      label: "Available", 
      badgeClass: "energy-card__badge--available",
      buttonClass: "energy-card__button",
      disabled: false
    },
    "2": { 
      label: "Pending", 
      badgeClass: "energy-card__badge--pending",
      buttonClass: "energy-card__button--pending",
      disabled: true
    }
  };

  const currentStatus = statusConfig[request.status] || statusConfig["0"];

  return (
    <div className="energy-card">
      <div className="energy-card__header">
        <div className="energy-card__amount">
          <span className="energy-card__value">{energyAmount}</span>
          <span className="energy-card__unit">kWh</span>
        </div>
        <div className={`energy-card__badge ${currentStatus.badgeClass}`}>
          {currentStatus.label}
        </div>
      </div>

      <div className="energy-card__body">
        <div className="energy-card__seller">
          <span className="energy-card__label">Seller:</span>
          <span className="energy-card__address">{sellerAddress}</span>
        </div>

        <div className="energy-card__price">
          <div className="energy-card__price-item">
            <span className="energy-card__label">Price:</span>
            <span className="energy-card__value">{priceEth} ETH</span>
          </div>
         <div className="energy-card__price-item">
            <span className="energy-card__label">Total:</span>
            <span className="energy-card__value">{priceEth} ETH</span>
          </div>
 
        </div>
      </div>

      <div className="energy-card__footer">
        <button 
          className={`energy-card__button ${currentStatus.buttonClass}`}
          onClick={currentStatus.disabled ? undefined : handlePurchase}
          disabled={currentStatus.disabled}
        >
          {currentStatus.disabled ? currentStatus.label : "Buy Energy"}
        </button>
      </div>
    </div>
  );
};

export default Card;