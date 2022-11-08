import { Center, Icon, Text } from "native-base"
import Logo from '../assets/logo.svg'
import { Button } from "../components/Button"
import {Fontisto} from '@expo/vector-icons'
import { useAuth } from "../hooks/useAuth"


export function SignIn(){
    const {singIn, isUserLoading} = useAuth();
    
    return(
        <Center flex={1} bgColor="gray.900" p="7">
           <Logo width={212} height={40}/>
          <Button
          type="SECONDARY"
          leftIcon={<Icon as={Fontisto} name='google' color={"white"} size="md" />} 
          title="ENTRAR COM O GOOGLE"
          mt="12"
          onPress={singIn}
          //isLoading={isUserLoading}
          _loading={{_spinner: {color: 'white'}}}
          />
          <Text color="white" textAlign="center" mt='4'>
            Não ultilizamos nenhuma informação além {'\n'} do seu e-mail para ciração de sua conta.
          </Text>
        </Center>
    )
}