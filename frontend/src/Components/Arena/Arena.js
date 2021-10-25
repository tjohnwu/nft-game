import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformCharacterData } from "../../constants";
import myEpicGame from "../../MyEpicGame.json";
import "./Arena.css";

/*
 * We pass in our characterNFT metadata so we can a cool card in our UI
 */
const Arena = ({ characterNFT, setCharacterNFT }) => {
  // State
  const [gameContract, setGameContract] = useState(null);
  const [bigCat, setBigCat] = useState(null);
  const [attackState, setAttackState] = useState("");

  // UseEffects
  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      setGameContract(gameContract);
    } else {
      console.log("Ethereum object not found");
    }
  }, []);

  useEffect(() => {
    /*
     * Setup async function that will get the bigCat from our contract and sets in state
     */
    const fetchBigCat = async () => {
      const bigCatTxn = await gameContract.getBigCat();
      console.log("Big cat:", bigCatTxn);
      setBigCat(transformCharacterData(bigCatTxn));
    };

    /*
     * Setup logic when this event is fired off
     */
    const onAttackComplete = (newBigCatHp, newPlayerHp) => {
      const bigCatHp = newBigCatHp.toNumber();
      const playerHp = newPlayerHp.toNumber();

      console.log(
        `AttackComplete: Big Cat Hp: ${bigCatHp} Player Hp: ${playerHp}`
      );

      /*
       * Update both player and bigCat Hp
       */
      setBigCat((prevState) => {
        return { ...prevState, hp: bigCatHp };
      });

      setCharacterNFT((prevState) => {
        return { ...prevState, hp: playerHp };
      });
    };

    if (gameContract) {
      /*
       * gameContract is ready to go! Let's fetch our bigCat
       */
      fetchBigCat();
      gameContract.on("AttackComplete", onAttackComplete);
    }

    return () => {
      if (gameContract) {
        gameContract.off("AttackComplete", onAttackComplete);
      }
    };
  }, [gameContract]);

  const runAttackAction = async () => {
    try {
      if (gameContract) {
        setAttackState("attacking");
        console.log("Attacking boss...");
        const attackTxn = await gameContract.attackBoss();
        await attackTxn.wait();
        console.log("attackTxn:", attackTxn);
        setAttackState("hit");
      }
    } catch (error) {
      console.error("Error attacking boss:", error);
      setAttackState("");
    }
  };

  return (
    <div className="arena-container">
      {/* Replace your bigCat UI with this */}
      {bigCat && (
        <div className="boss-container">
          <div className={`boss-content ${attackState}`}>
            <h2>🔥 {bigCat.name} 🔥</h2>
            <div className="image-content">
              <img src={bigCat.imageURI} alt={`Boss ${bigCat.name}`} />
              <div className="health-bar">
                <progress value={bigCat.hp} max={bigCat.maxHp} />
                <p>{`${bigCat.hp} / ${bigCat.maxHp} HP`}</p>
              </div>
            </div>
          </div>
          <div className="attack-container">
            <button className="cta-button" onClick={runAttackAction}>
              {`💥 Attack ${bigCat.name}`}
            </button>
          </div>
        </div>
      )}

      {characterNFT && (
        <div className="players-container">
          <div className="player-container">
            <h2>Your Character</h2>
            <div className="player">
              <div className="image-content">
                <h2>{characterNFT.name}</h2>
                <img
                  src={characterNFT.imageURI}
                  alt={`Character ${characterNFT.name}`}
                />
                <div className="health-bar">
                  <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                  <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
                </div>
              </div>
              <div className="stats">
                <h4>{`⚔️ Attack Damage: ${characterNFT.attackDamage}`}</h4>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Arena;
