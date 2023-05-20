import { useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core";
import creditstakeAbi from '../json/creditstake.json';
import tokenAbi from '../json/token.json';
import { contract } from "./constant";
import { multiCallContractConnect, MulticallContractWeb3 } from "./useContracts";
import { getWeb3 } from "./connectors";
import { CREDIT_CHAIN_ID } from "./constant";
import { toast } from "react-toastify";


export const useAccountStats = (updater) => {
    let { chainId, account } = useWeb3React();
    let web3 = getWeb3(CREDIT_CHAIN_ID);


    const [stats, setStats] = useState({
        totalStakedTokenUser: 0,
        totalUnstakedTokenUser: 0,
        totalClaimedRewardTokenUser: 0,
        stakeCount: 0,
        alreadyExists: false,
        totalStakeHistory: [],
        stakeTokenDecimals: 18,
        rewardTokenDecimals: 0,
        stakeTokenBalance: 0,
        currentStake: 0,
        rewardHistory : []
    });

    const mc = MulticallContractWeb3(CREDIT_CHAIN_ID);
    const mcc = multiCallContractConnect(CREDIT_CHAIN_ID);
    let stakeContract = new web3.eth.Contract(creditstakeAbi, contract[CREDIT_CHAIN_ID].STAKE_ADDRESS);



    useEffect(() => {
        const fetch = async () => {
            try {
                
                let stakeInfoArray = [];
                let rewardArray = [];
                const data = await mc.aggregate([
                    stakeContract.methods.Stakers(account), //0
                    stakeContract.methods.rewardToken() //1
                ]);

                let rewardTokenContract = new web3.eth.Contract(tokenAbi, data[1]);

                const tokenData = await mc.aggregate([
                    rewardTokenContract.methods.decimals(), //0
                    mcc.methods.getEthBalance(account), //1
                ]);

                if (parseInt(data[0][3]) > 0) {

                    let callArray = [];
                    let rcallArray = [];
                    for (let i = 0; i < data[0][3]; i++) {
                        callArray[i] = stakeContract.methods.stakersRecord(account, i);
                        rcallArray[i] = stakeContract.methods.realtimeRewardPerBlock (account, i);
                    }

                    stakeInfoArray = await mc.aggregate(callArray);
                    rewardArray = await mc.aggregate(rcallArray);

                    
                }

                setStats({
                    totalStakedTokenUser: data[0][0] / Math.pow(10, 18),
                    totalUnstakedTokenUser: data[0][1] / Math.pow(10, 18),
                    totalClaimedRewardTokenUser: data[0][2] / Math.pow(10, tokenData[0]),
                    stakeCount: data[0][3],
                    alreadyExists: data[0][4],
                    totalStakeHistory: stakeInfoArray,
                    rewardHistory : rewardArray,
                    stakeTokenDecimals: 18,
                    rewardTokenDecimals: tokenData[0],
                    stakeTokenBalance: tokenData[1] / Math.pow(10, 18),
                    currentStake: (parseFloat(data[0][0]) - parseFloat(data[0][1])) / Math.pow(10, 18),

                })
            }
            catch (err) {
                console.log(err.message);
                toast.error(err.reason)
            }
        }

        if (mc && account) {
            fetch();
        }
        else {
            setStats({
                totalStakedTokenUser: 0,
                totalUnstakedTokenUser: 0,
                totalClaimedRewardTokenUser: 0,
                stakeCount: 0,
                alreadyExists: false,
                totalStakeHistory: [],
                stakeTokenDecimals: 18,
                rewardTokenDecimals: 0,
                stakeTokenBalance: 0,
                currentStake: 0,
                rewardHistory : []
            })
        }
        // eslint-disable-next-line
    }, [updater, chainId, account]);

    return stats;
}
