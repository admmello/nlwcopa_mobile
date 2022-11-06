import { VStack, Icon, useToast, FlatList } from 'native-base'
import { Octicons } from '@expo/vector-icons'

import { Button } from '../components/Button'
import { Header } from '../components/Header'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { api } from '../services/api'
import { useCallback, useState } from 'react'
import { PoolCard, PoolCardPros } from '../components/PoolCard'
import { EmptyPoolList } from '../components/EmptyPoolList'
import { Loading } from '../components/Loading'

export function Polls() {
  const [isLoading, setIsLoading] = useState(true)
  const [polls, setPolls] = useState<PoolCardPros[]>([])

  const { navigate } = useNavigation()
  const toast = useToast()

  async function fetchPolls() {
    try {
      setIsLoading(true)
      const response = await api.get('/pools')

      setPolls(response.data.pools)
    } catch (error) {
      console.log(error)

      toast.show({
        title: 'Não foi possível listar seus bolões',
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchPolls()
    }, [])
  )

  return (
    <VStack flex={1} bg='gray.900'>
      <Header title='meus bolões' />
      <VStack
        mt={6}
        mx={5}
        borderBottomWidth={1}
        borderBottomColor='gray.600'
        mb={4}
        pb={4}
      >
        <Button
          title='buscar bolão por código'
          leftIcon={
            <Icon as={Octicons} name='search' color='black' size='md' />
          }
          onPress={() => navigate('find')}
        />
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={polls}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PoolCard
              data={item}
              onPress={() => navigate('details', { id: item.id })}
            />
          )}
          px={5}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{
            pb: 10,
          }}
          ListEmptyComponent={() => <EmptyPoolList />}
        />
      )}
    </VStack>
  )
}
