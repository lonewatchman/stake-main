import { useState } from "react";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import { CREDIT_CHAIN_ID, CREDIT_STAKE_APY2, contract } from "../hooks/constant";
import { formatPrice, getContract } from "../hooks/contractHelper";
import { useWeb3React } from "@web3-react/core";
import { toast } from 'react-toastify';
import creditstakeAbi from '../json/creditstake.json';
import { ethers } from "ethers";
import { getWeb3 } from "../hooks/connectors";
import { useCommonStats } from "../hooks/useValidatorCommon";
import { useAccountStats } from "../hooks/useValidatorAccount";



function Validator() {
    const { account, chainId, library } = useWeb3React();
    const [updater, setUpdater] = useState(new Date());
    const commonStats = useCommonStats(updater);
    const accStats = useAccountStats(updater);
    const [selectedAPY, setSelectedAPY] = useState(0);
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(0);
    const [error, setError] = useState('');
    const timeElapsed = Date.now();
    const [endtime, setEndtime] = useState(new Date(parseInt(timeElapsed) + parseInt(CREDIT_STAKE_APY2[0].time * 86400 * 1000)));


    const handleChangeAPY = (e, index) => {
        e.preventDefault();
        setSelectedAPY(index);
        setEndtime(new Date(parseInt(timeElapsed) + parseInt(CREDIT_STAKE_APY2[index].time * 86400 * 1000)))
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
                    if (chainId === CREDIT_CHAIN_ID) {
                        if (parseFloat(accStats.stakeTokenBalance) >= parseFloat(amount)) {
                            let tokenStakingAddress = contract[CREDIT_CHAIN_ID].STAKE_ADDRESS2;
                            let stakeContract = getContract(creditstakeAbi, tokenStakingAddress, library);
                            let stakeAmount = ethers.utils.parseUnits(amount.toString(), accStats.stakeTokenDecimals);

                            let tx = await stakeContract.stake( selectedAPY, { 'from': account , value : stakeAmount.toString() });
                            const resolveAfter3Sec = new Promise(resolve => setTimeout(resolve, 5000));
                            toast.promise(
                                resolveAfter3Sec,
                                {
                                    pending: 'Waiting for confirmation 👌',
                                }
                            )

                            var interval = setInterval(async function () {
                                let web3 = getWeb3(CREDIT_CHAIN_ID);
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
                        toast.error('Please select Credit Mainet Network !');
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
                if (chainId === CREDIT_CHAIN_ID) {
                    let tokenStakingAddress = contract[CREDIT_CHAIN_ID].STAKE_ADDRESS2;
                    let stakeContract = getContract(creditstakeAbi, tokenStakingAddress, library);


                    let tx = await stakeContract.unstake(index, { 'from': account });
                    const resolveAfter3Sec = new Promise(resolve => setTimeout(resolve, 5000));
                    toast.promise(
                        resolveAfter3Sec,
                        {
                            pending: 'Waiting for confirmation 👌',
                        }
                    )

                    var interval = setInterval(async function () {
                        let web3 = getWeb3(CREDIT_CHAIN_ID);
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
                    toast.error('Please select Credit Mainet Network !');
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
                if (chainId === CREDIT_CHAIN_ID) {
                    let tokenStakingAddress = contract[CREDIT_CHAIN_ID].STAKE_ADDRESS2;
                    let stakeContract = getContract(creditstakeAbi, tokenStakingAddress, library);


                    let tx = await stakeContract.harvest(index, { 'from': account });
                    const resolveAfter3Sec = new Promise(resolve => setTimeout(resolve, 5000));
                    toast.promise(
                        resolveAfter3Sec,
                        {
                            pending: 'Waiting for confirmation 👌',
                        }
                    )

                    var interval = setInterval(async function () {
                        let web3 = getWeb3(CREDIT_CHAIN_ID);
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
                    toast.error('Please select Credit Mainet Network !');
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
                            <h1>CREDIT Staking Dashboard</h1>
                            <Button className="theme-btn">Stake Credit</Button>
                            <h4>Powered by <img src={require('../Assets/img/logo-sm.png').default} alt="" /> <span>CREDIT</span></h4>
                        </Col>
                        <Col xs={12} md={6} lg={5}>
                            <div className="stake-box">
                                <div className="staking-info">
                                    <div className="all-info">
                                        <div className="label-1">CREDIT STAKED</div>
                                        <div className="credit-stacked">{commonStats.totalStakedToken ? formatPrice(commonStats.totalStakedToken) : 0} <span>{commonStats.stakeTokenSymbol ? commonStats.stakeTokenSymbol : ' - '}</span></div>
                                    </div>
                                    <div className="all-info">
                                        <div className="label-1">CREDIT VALIDATORS</div>
                                        <div className="credit-stacked">{commonStats.totalStakers ? formatPrice(commonStats.totalStakers) : 0}</div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="calculator-section">
                <div className="curve-left">
                    <img src={require('../Assets/img/why-token-curve-left.png').default} alt="curve-left" />
                </div>
                <div className="curve-right">
                    <img src={require('../Assets/img/why-token-curve-right.png').default} alt="curve-right" />
                </div>
                <Container>
                    <Row className="justify-content-center">
                        <Col xs={12} sm={12} md={8} lg={8}>
                            <div className="calc-box">
                                <h3>$CREDIT Calculator</h3>
                                <p>Stake CREDIT to earn USDT rewards up to 50% APY.</p>
                                <div className="add-liquidity">
                                    <div className="content">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="labels">
                                                <h6>CREDIT</h6>
                                            </div>
                                            <div className="labels d-flex">
                                                <input type="text" value={amount} onChange={(e) => handleChangeAmount(e)} placeholder="5000" />
                                                <Button className="input-button" onClick={() => handleMaxAmount()}>Max</Button>
                                            </div>

                                        </div>
                                        <span style={{"fontSize" : "14px"}} className='text-danger'>{error}</span>
                                    </div>
                                </div>
                                <div className="plus-sys">+</div>
                                <div className="add-liquidity-2">
                                    <p>Lock tokens for</p>
                                    <div className="text-center">
                                        {CREDIT_STAKE_APY2.map((rowdata, index) => {
                                            return (
                                                <button key={index} onClick={(e) => handleChangeAPY(e, index)} className={`btn-box ${rowdata.apy === CREDIT_STAKE_APY2[selectedAPY].apy ? 'active' : ''}`}>
                                                    {rowdata.time ? rowdata.time : ' - '} Days
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="plus-sys">
                                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
                                </div>
                                <h4>Upto {CREDIT_STAKE_APY2[selectedAPY].apy}% Returns on {CREDIT_STAKE_APY2[selectedAPY].time} Days</h4>
                                <h4>locked until {endtime.toUTCString()}</h4>
                                {account ? (
                                    <Button className="theme-btn w-100 mt-3" onClick={() => !loading ? handleStake() : null}>{loading ? 'Loading…' : 'Stake'}</Button>
                                ) : (
                                    <Button className="theme-btn w-100 mt-3">Connect Wallet</Button>
                                )}

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
                                <div className="title">USDT Earned</div>
                                <h4>{accStats.totalClaimedRewardTokenUser ? formatPrice(accStats.totalClaimedRewardTokenUser) : 0}</h4>
                            </div>
                        </Col>
                        <Col sm={12} md={6} lg={4}>
                            <div className="details-box">
                                <div className="title">Your CREDIT Wallet Balance</div>
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

export default Validator
