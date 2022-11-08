import { VStack, useToast, Toast, HStack } from "native-base"
import { Header } from "../components/Header";
import {useRoute} from '@react-navigation/native'
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { Guesses } from "../components/Guesses";

import { Option } from "../components/Option";
import {api} from '../services/api'
import {PoolCardProps} from '../components/PoolCard'
import { PoolHeader } from "../components/PoolHeader";
import { Share } from "react-native";
import {EmptyMyPoolList} from '../components/EmptyMyPoolList'

interface RouteParams {
    id: string;
}

export function Details(){
    const [poolDetails, setpoolDetails] = useState<PoolCardProps>({} as PoolCardProps)
    const [isLoading, setLoading] = useState(true)
    const route = useRoute();
    const toast = useToast();
    const [optionSelected, setOptionSelected] = useState<'Seus palpites' | 'Ranking do grupo'> ('Seus palpites')
    const {id} = route.params as RouteParams

    async function fetchPoolDetails() {
        try {
            setLoading(true)

            const response = await api.get(`/pools/${id}`);
           setpoolDetails(response.data.pool)
        } catch (error) {
            console.log(error)
            toast.show({
                title: "Não foi possivel carregar os detalhes do bolão",
                placement: "top",
                bgColor: "red.500"
            })
            
        }finally{
            setLoading(false)
        }
    }

    async function handleCodeShere() {
        await Share.share({
            message: poolDetails.code
        })
    }
    useEffect(()=>{
        fetchPoolDetails()
    },[id])
    if(isLoading){
        return(
            <Loading/>
        )
    }
    return(
        <VStack flex={1} bgColor="gray.900">
            <Header onShere={handleCodeShere} title={poolDetails.title} showBackButton showShareButton/>
            {
                poolDetails._count?.participants > 0 ?
                <VStack px={5} flex={1}>
                    <PoolHeader data={poolDetails}/>
                    <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
                        <Option title="Seus palpites" isSelected={optionSelected === 'Seus palpites'}
                        onPress={()=> setOptionSelected('Seus palpites')}
                        />
                        <Option title="Seus palpites" isSelected={optionSelected === 'Ranking do grupo'}
                        onPress={()=> setOptionSelected('Ranking do grupo')}
                        />

                    </HStack>
                    <Guesses poolId={poolDetails.id} code={poolDetails.code}/>
                </VStack> : <EmptyMyPoolList code={poolDetails.code}/>
            }

        </VStack>
    );
}