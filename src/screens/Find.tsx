import { Heading, VStack, Text, useToast} from "native-base";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useState } from "react";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export function Find(){
    const [isLoading, setIsLoading] = useState(false)
    const [code, setCode] = useState("");
    const {navigate} = useNavigation();
    const toast = useToast();
    async function handleJoinPool(){
        try {
           setIsLoading(true)
           
           if(!code.trim()){
            return toast.show({
                title: 'Informe o código',
                placement: 'top',
                bgColor: 'red.500'
            })
           }

           await api.post('/pool/join', {code});
           toast.show({
            title: 'Você entrou no bolão com sucesso!!',
            placement: 'top',
            bgColor: 'red.500'
        })
           navigate('pools');
           



        } catch (error) {
            console.log(error)
            setIsLoading(false)
            if( error.response?.data.message == 'pool not found.'){
                return toast.show({
                    title: "bolão não encontrado!",
                    placement: "top",
                    bgColor: "red.500"
                })
                
            }

            if( error.response?.data.message == 'You already joined this pool.'){
                return toast.show({
                    title: "Você já está nesse bolão!!",
                    placement: "top",
                    bgColor: "red.500"
                })
                
            }

            toast.show({
                title: "Não foi possivel encontrar o bolão",
                placement: "top",
                bgColor: "red.500"
            })

            
        }
        


    }


    return(
        <VStack flex={1} bgColor="gray.900">
            <Header title="Buscar por código"/>

            <VStack mt={8} mx={5} alignItems="center">

                <Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center">
                    Encontre um bolão através de{'\n'}seu código único
                </Heading>

                <Input
                autoCapitalize="characters"
                onChangeText={setCode}
                mb={2} placeholder="Qual o código do seu bolão"/>

                <Button title="BUSCAR BOLÃO"/>
            </VStack>
        </VStack>
    )
}