import React, { useState } from "react";
import Form from "../components/Form";
import { useAccount } from "../context/AccountContext";
import { ethers } from "ethers";
import config from "../config.json";
import EnergyToken from "../abis/EnergyToken.json";

const Sell = () => {
  const account = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const sellHandler = async (amount, price) => {
    setIsLoading(true);
    setIsSuccess(false);
    try {
      const signer = await account.provider.getSigner();
      const transaction = await account.energyToken
        .connect(signer)
        .listSellRequest(amount, price);
      await transaction.wait();
      setIsSuccess(true);
    } catch (error) {
      console.error("Error listing sell request:", error);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sell-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <Form handler={sellHandler} />
            
            {isLoading && (
              <div className="text-center my-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p>Processing your listing...</p>
              </div>
            )}

            {isSuccess && (
              <div className="alert alert-success mt-4">
                <div className="d-flex align-items-center">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  <span>Your energy listing was successfully added to the marketplace!</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sell;