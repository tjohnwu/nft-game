const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");
  const gameContract = await gameContractFactory.deploy(
    ["Sunglasses Catryoshka", "Green Picnic Boy", "Peace Among Cats"], // Names
    [
      "https://lh3.googleusercontent.com/kdthkC4K9WQqK5WCc9IF4KqcX1ZHsGoMqBKbOZ8euOMXxzyuHX9paShI4uDOzz3Tu_U44vUBf1Qt_NXBbDIzjTnhDw9Ulsw4x25O=w600", // Images
      "https://lh3.googleusercontent.com/KOvC5wQG3po_E-GHO8RBFnlxQJ72vXwlYyCy0D0oYdhIgVm4oORCkamWtOqVTQebZIK-mHGqVlx_AGqHTd-XhwiIaJUTU98pXNGF_Q=w600",
      "https://lh3.googleusercontent.com/BKcPTjxdZN6h4c9OZukmCJywdxJCj9qdnnp-wU_5BOSnrgh_vuoRSTL-bGntKFWErKE2EJCrgWly0sKaJ-j3jeexrlf3_0vHApU1JQ=w600",
    ],
    [75, 200, 500], // HP values
    [100, 50, 10], // Attack damage values
    "Simpson Cat",
    "https://lh3.googleusercontent.com/z-J8pzExqnbXK1eYYbJudfwzWgSotbbpuwBPRp3mgeJqBnRQKeN49yHp57HF7z7-Zc-UZa620U4xKppMh2YzS-kVFDdlfj6az9bi=w600",
    5000,
    100
  );
  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);

  // Get the value of the NFT's URI.
  //let returnedTokenUri = await gameContract.tokenURI(1);
  //console.log("Token URI:", returnedTokenUri);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
