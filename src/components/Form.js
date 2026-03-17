import React, { useState } from "react";

const Form = ({ handler }) => {
  const [amount, setAmount] = useState(0);
  const [price, setPrice] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handler(amount, price);
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Sell Your Energy</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="energyAmount" className="form-label fw-semibold">
                    Energy Amount (kWh)
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    id="energyAmount"
                    min="1"
                    step="0.1"
                    required
                  />
                  <div className="form-text text-muted">
                    Minimum 1 kWh
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="price" className="form-label fw-semibold">
                    Total Price (ETH)
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-lg"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    id="price"
                    min="0.0001"
                    step="0.0001"
                    required
                  />
                  <div className="form-text text-muted">
                    Current market average: ~0.00015 ETH/kWh
                  </div>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-lg">
                    List Energy for Sale
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;