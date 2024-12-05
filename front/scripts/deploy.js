// const hre = require("hardhat")
import hre from "hardhat";

async function main() {


    const nftMarketPlace = await hre.ethers.deployContract(
        "NFTMarketPlace"
    );


    await nftMarketPlace.waitForDeployment;

    console.log(`deployed to ${nftMarketPlace.target}`);
}

main().catch((error) => {
    console.log(error);
    process.exitCode = 1;
})






// async function main(){
//     const NFTMarketPlace = await hre.ethers.getContractFactory("NFTMarketPlace");
//     const nftMarketPlace =await NFTMarketPlace.deploy();

//     await nftMarketPlace.deployed();

//     console.log(
//         `Drployed contract address ${nftMarketPlace.address}`
//     )

// }

// main().catch((error)=>{
//     console.log(error);
//     process.exitCode = 1;
// })
