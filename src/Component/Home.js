import { useState } from "react";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import { BSC_CHAIN_ID, BSC_STAKE_APY, contract } from "../hooks/constant";
import { formatPrice, getContract } from "../hooks/contractHelper";
import { useCommonStats } from "../hooks/useBscCommon";
import { useAccountStats } from "../hooks/useBscAccount";
import { useWeb3React } from "@web3-react/core";
import { toast } from 'react-toastify';
import tokenAbi from '../json/token.json';
import stakeAbi from '../json/bscstake.json';
import { ethers } from "ethers";
import { getWeb3 } from "../hooks/connectors";



function Home() {
    const { account, chainId, library } = useWeb3React();
    const [updater, setUpdater] = useState(new Date());
    const commonStats = useCommonStats(updater);
    const accStats = useAccountStats(updater);
    const [selectedAPY, setSelectedAPY] = useState(0);
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(0);
    const [error, setError] = useState('');
    const timeElapsed = Date.now();
    const [endtime, setEndtime] = useState(new Date(parseInt(timeElapsed) + parseInt(BSC_STAKE_APY[0].time * 86400 * 1000)));


    const handleChangeAPY = (e, index) => {
        e.preventDefault();
        setSelectedAPY(index);
        setEndtime(new Date(parseInt(timeElapsed) + parseInt(BSC_STAKE_APY[index].time * 86400 * 1000)))
    }

    const handleApprove = async () => {
        if (account) {
            if (chainId === BSC_CHAIN_ID && commonStats.stakeTokenAddress !== '') {
                try {

                    setLoading(true);
                    let stakingContract = contract[BSC_CHAIN_ID].STAKE_ADDRESS;
                    let stakeContract = getContract(tokenAbi, commonStats.stakeTokenAddress, library);
                    let amount = ethers.utils.parseEther('100000000000000000').toString();

                    let tx = await stakeContract.approve(stakingContract, amount, { 'from': account });
                    const resolveAfter3Sec = new Promise(resolve => setTimeout(resolve, 5000));
                    toast.promise(
                        resolveAfter3Sec,
                        {
                            pending: 'Waiting for confirmation',
                        }
                    )

                    var interval = setInterval(async function () {
                        let web3 = getWeb3(BSC_CHAIN_ID);
                        var response = await web3.eth.getTransactionReceipt(tx.hash);
                        if (response != null) {
                            clearInterval(interval)
                            if (response.status === true) {
                                toast.success('success ! your last transaction is success 👍');
                                setLoading(false);
                                setUpdater(new Date());
                            }
                            else if (response.status === false) {
                                toast.error('error ! Your last transaction is failed.');
                                setLoading(false);
                                setUpdater(new Date());
                            }
                            else {
                                toast.error('error ! something went wrong.');
                                setLoading(false);
                                setUpdater(new Date());
                            }
                        }
                    }, 5000);
                }
                catch (err) {
                    console.log(err.message)
                    toast.error(err.reason ? err.reason : err.message);
                    setLoading(false);
                }
            }
            else {
                toast.error('Please select Smart Chain Network !');
                setLoading(false);
            }

        }
        else {
            toast.error('Please Connect Wallet!');
            setLoading(false);
        }
    }

    const handleChangeAmount = (e) => {
        e.preventDefault();
        setAmount(e.target.value);
        if (isNaN(e.target.value)) {
            setError('Please enter valid amount.');
        }
        else if (parseFloat(e.target.value) < parseFloat(commonStats.minimumStakeToken) || parseFloat(e.target.value) > parseFloat(commonStats.maxStakeableToken)) {
            setError(`Amount must be greater than ${commonStats.minimumStakeToken} and less than ${commonStats.maxStakeableToken}`);
        }
        else {
            setError('');
        }
        return;
    }


    const handleMaxAmount = () => {
        parseFloat(accStats.stakeTokenBalance) > parseFloat(commonStats.maxStakeableToken) ?
            setAmount(commonStats.maxStakeableToken) : setAmount(accStats.stakeTokenBalance);
        setError('');
    }

    const handleStake = async () => {
        setLoading(true);
        try {
            if (amount > 0 && !isNaN(amount) && parseFloat(amount) >= parseFloat(commonStats.minimumStakeToken) && parseFloat(amount) <= parseFloat(commonStats.maxStakeableToken)) {
                if (account) {
                    if (chainId === BSC_CHAIN_ID) {
                        if (parseFloat(accStats.stakeTokenBalance) >= parseFloat(amount)) {
                            let tokenStakingAddress = contract[BSC_CHAIN_ID].STAKE_ADDRESS;
                            let stakeContract = getContract(stakeAbi, tokenStakingAddress, library);
                            let stakeAmount = ethers.utils.parseUnits(amount.toString(), accStats.stakeTokenDecimals);

                            let tx = await stakeContract.stake(stakeAmount.toString(), selectedAPY, { 'from': account });
                            const resolveAfter3Sec = new Promise(resolve => setTimeout(resolve, 5000));
                            toast.promise(
                                resolveAfter3Sec,
                                {
                                    pending: 'Waiting for confirmation 👌',
                                }
                            )

                            var interval = setInterval(async function () {
                                let web3 = getWeb3(BSC_CHAIN_ID);
                                var response = await web3.eth.getTransactionReceipt(tx.hash);
                                if (response != null) {
                                    clearInterval(interval)
                                    if (response.status === true) {
                                        toast.success('success ! your last transaction is success 👍');
                                        setUpdater(new Date());
                                        setLoading(false);
                                    }
                                    else if (response.status === false) {
                                        toast.error('error ! Your last transaction is failed.');
                                        setUpdater(new Date());
                                        setLoading(false);
                                    }
                                    else {
                                        toast.error('error ! something went wrong.');
                                        setUpdater(new Date());
                                        setLoading(false);
                                    }
                                }
                            }, 5000);

                        }
                        else {
                            toast.error('you don\'t have enough balance !');
                            setLoading(false);
                        }

                    }
                    else {
                        toast.error('Please select Smart Chain Network !');
                        setLoading(false);
                    }
                }
                else {
                    toast.error('Please Connect Wallet!');
                    setLoading(false);
                }
            }
            else {
                toast.error('Please Enter Valid Amount !');
                setLoading(false);
            }
        }
        catch (err) {
            toast.error(err.reason);
            setLoading(false);
        }
    }

    const handleUnStake = async (index) => {

        try {

            if (account) {
                if (chainId === BSC_CHAIN_ID) {
                    let tokenStakingAddress = contract[BSC_CHAIN_ID].STAKE_ADDRESS;
                    let stakeContract = getContract(stakeAbi, tokenStakingAddress, library);


                    let tx = await stakeContract.unstake(index, { 'from': account });
                    const resolveAfter3Sec = new Promise(resolve => setTimeout(resolve, 5000));
                    toast.promise(
                        resolveAfter3Sec,
                        {
                            pending: 'Waiting for confirmation 👌',
                        }
                    )

                    var interval = setInterval(async function () {
                        let web3 = getWeb3(BSC_CHAIN_ID);
                        var response = await web3.eth.getTransactionReceipt(tx.hash);
                        if (response != null) {
                            clearInterval(interval)
                            if (response.status === true) {
                                toast.success('success ! your last transaction is success 👍');
                                setUpdater(new Date());
                                setLoading(false);
                            }
                            else if (response.status === false) {
                                toast.error('error ! Your last transaction is failed.');
                                setUpdater(new Date());
                                setLoading(false);
                            }
                            else {
                                toast.error('error ! something went wrong.');
                                setUpdater(new Date());
                                setLoading(false);
                            }
                        }
                    }, 5000);



                }
                else {
                    toast.error('Please select Smart Chain Network !');
                    setLoading(false);
                }
            }
            else {
                toast.error('Please Connect Wallet!');
                setLoading(false);
            }

        }
        catch (err) {
            toast.error(err.reason);
            setLoading(false);
        }
    }

    const handleHarvest = async (index) => {
        try {

            if (account) {
                if (chainId === BSC_CHAIN_ID) {
                    let tokenStakingAddress = contract[BSC_CHAIN_ID].STAKE_ADDRESS;
                    let stakeContract = getContract(stakeAbi, tokenStakingAddress, library);


                    let tx = await stakeContract.harvest(index, { 'from': account });
                    const resolveAfter3Sec = new Promise(resolve => setTimeout(resolve, 5000));
                    toast.promise(
                        resolveAfter3Sec,
                        {
                            pending: 'Waiting for confirmation 👌',
                        }
                    )

                    var interval = setInterval(async function () {
                        let web3 = getWeb3(BSC_CHAIN_ID);
                        var response = await web3.eth.getTransactionReceipt(tx.hash);
                        if (response != null) {
                            clearInterval(interval)
                            if (response.status === true) {
                                toast.success('success ! your last transaction is success 👍');
                                setUpdater(new Date());
                                setLoading(false);
                            }
                            else if (response.status === false) {
                                toast.error('error ! Your last transaction is failed.');
                                setUpdater(new Date());
                                setLoading(false);
                            }
                            else {
                                toast.error('error ! something went wrong.');
                                setUpdater(new Date());
                                setLoading(false);
                            }
                        }
                    }, 5000);



                }
                else {
                    toast.error('Please select Smart Chain Network !');
                    setLoading(false);
                }
            }
            else {
                toast.error('Please Connect Wallet!');
                setLoading(false);
            }

        }
        catch (err) {
            toast.error(err.reason);
            setLoading(false);
        }
    }

    return (
        <>
            <section className="banner-section">
                <div className="bg-layer"></div>
                <Container>
                    <Row>
                        <Col xs={12} md={6} lg={7}>
                            <h1>WCREDIT Staking Dashboard</h1>
                            <Button className="theme-btn">Stake WCredit</Button>
                            <h4>Powered by <img src={require('../Assets/img/bsc-icon.png').default} alt="" /> <span>BSC</span></h4>
                        </Col>
                        <Col xs={12} md={6} lg={5}>
                            <div className="stake-box">
                                <div className="staking-info">
                                    <div className="all-info">
                                        <div className="label-1">WCREDIT STAKED</div>
                                        <div className="credit-stacked">{commonStats.totalStakedToken ? formatPrice(commonStats.totalStakedToken) : 0} <span>{commonStats.stakeTokenSymbol ? commonStats.stakeTokenSymbol : ' - '}</span></div>
                                    </div>
                                    <div className="all-info">
                                        <div className="label-1">WCREDIT STAKERS</div>
                                        <div className="credit-stacked">{commonStats.totalStakers ? formatPrice(commonStats.totalStakers) : 0}</div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            

            <section className="details-section">
                <Container>
                    <Row>
                        <Col sm={12} md={6} lg={4}>
                            <div className="details-box">
                                <div className="title">BUSD Earned</div>
                                <h4>{accStats.totalClaimedRewardTokenUser ? formatPrice(accStats.totalClaimedRewardTokenUser) : 0}</h4>
                            </div>
                        </Col>
                        <Col sm={12} md={6} lg={4}>
                            <div className="details-box">
                                <div className="title">Your WCREDIT Wallet Balance</div>
                                <h4>{accStats.stakeTokenBalance ? formatPrice(accStats.stakeTokenBalance) : 0}</h4>
                            </div>
                        </Col>
                        <Col sm={12} md={6} lg={4}>
                           <div className="details-box">
                                <div className="title">Claimed Reward</div>
                                <h4>{accStats.totalClaimedRewardTokenUser ? formatPrice(accStats.totalClaimedRewardTokenUser) : 0}</h4>
                            </div>
                        </Col>
                        <Col sm={12} md={6} lg={4}>
                            <div className="details-box">
                                <div className="title">Current Staked</div>
                                <h4>{accStats.currentStake ? formatPrice(accStats.currentStake) : 0}</h4>
                            </div>
                        </Col>
                        <Col sm={12} md={6} lg={4}>
                            <div className="details-box">
                                <div className="title">Total Staked</div>
                                <h4>{accStats.totalStakedTokenUser ? formatPrice(accStats.totalStakedTokenUser) : 0}</h4>
                            </div>
                        </Col>
                        <Col sm={12} md={6} lg={4}>
                            <div className="details-box">
                                <div className="title">Total UnStaked</div>
                                <h4>{accStats.totalUnstakedTokenUser ? formatPrice(accStats.totalUnstakedTokenUser) : 0}</h4>
                            </div>
                        </Col>
                    </Row>
                    <Row className="mt-5">
                        <Col sm={12}>
                            <h3 className="text-white">Transctions History</h3>
                            <Table bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Staked Amount</th>
                                        <th>Stake Date</th>
                                        <th>Unstake Date</th>
                                        <th>Earn Reward</th>
                                        <th>Unstake</th>
                                        <th>Harvest</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {accStats.totalStakeHistory.length > 0 ? (
                                        accStats.totalStakeHistory.map((rowdata, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{rowdata[2] ? formatPrice(rowdata[2] / Math.pow(10, accStats.stakeTokenDecimals)) : 0}</td>
                                                    <td>{rowdata[1] ? new Date(rowdata[1] * 1000).toGMTString() : ' - '}</td>
                                                    <td>{rowdata[0] ? new Date(rowdata[0] * 1000).toGMTString() : ' - '}</td>
                                                    <td>{accStats.rewardHistory[index] ? parseFloat(accStats.rewardHistory[index][0] / Math.pow(10, accStats.rewardTokenDecimals)).toFixed(5) : 0}</td>
                                                    <td><Button onClick={() => handleUnStake(index)} disabled={rowdata[10]} className="theme-btn">Unstake</Button></td>
                                                    <td><Button onClick={() => handleHarvest(index)} disabled={rowdata[10]} className="theme-btn">Harvest</Button></td>
                                                </tr>
                                            )
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={6}>
                                                <h5 className="m-0 text-white">You Have No Stake Record Yet.</h5>
                                            </td>
                                        </tr>
                                    )}

                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Container >
            </section >
        </>
    )
}

export default Home
