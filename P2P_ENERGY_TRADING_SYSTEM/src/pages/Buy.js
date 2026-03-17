import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { useAccount } from "../context/AccountContext";
import { ethers } from "ethers";
import config from "../config.json";
import EnergyToken from "../abis/EnergyToken.json";

const Buy = () => {
  const account = useAccount();
  const [listings, setListings] = useState([]); // Changed from availableListings
  const [loading, setLoading] = useState(true);

  const getListings = async () => { // Renamed from getAvailableListings
    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      const energyToken = new ethers.Contract(
        config[network.chainId].EnergyToken.address,
        EnergyToken,
        provider
      );

      const totalRequests = await energyToken.totalSellRequests();
      const allListings = [];

      for (let i = 1; i <= totalRequests; i++) {
        const request = await energyToken.getSellRequest(i);
        allListings.push({
          ...request,
          id: request.id.toString(),
          status: request.status.toString(), // Keep as string
          amount: request.amount.toString(),
          price: request.price.toString(),
          creator: request.creator.toString()
        });
      }

      setListings(allListings); // Now includes all statuses
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const completeHandler = async (id, price) => {
    setLoading(true);
    try {
      const signer = await account.provider.getSigner();
      const tx = await account.energyToken
        .connect(signer)
        .buyEnergy(id, { value: price, gasLimit: 5000000 });
      await tx.wait();
      await getListings(); // Refresh all listings after purchase
    } catch (error) {
      console.error("Purchase failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getListings();
  }, []);

  return (
    <div className="container py-4">
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-center mb-4">Energy Listings</h2> {/* Updated title */}
          
          {listings.length === 0 ? (
            <div className="alert alert-info text-center">
              No energy listings available
            </div>
          ) : (
            <div className="row g-3">
              {listings.map((listing) => (
                <div key={listing.id} className="col-md-6 col-lg-4">
                  <Card 
                    request={listing}
                    completeHandler={completeHandler}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Buy;