// src/hooks/useAdminCheck.js
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import EnergyToken from "../abis/EnergyToken.json";
import { energyTokenAddress } from "../config";

export const useAdminCheck = (account) => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!account?.address || !window.ethereum) return;

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(energyTokenAddress, EnergyToken, provider);

      try {
        const owner = await contract.owner();
        setIsAdmin(owner.toLowerCase() === account.address.toLowerCase());
      } catch (err) {
        console.error("Failed to check admin:", err);
      }
    };

    checkAdmin();
  }, [account?.address]);

  return isAdmin;
};
