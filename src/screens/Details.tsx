import { useRoute } from '@react-navigation/native'
import { useToast, VStack, HStack } from 'native-base'
import { useEffect, useState } from 'react'

import { api } from '../services/api'
import { Header } from '../components/Header'
import { Loading } from '../components/Loading'
import { PoolCardPros } from '../components/PoolCard'
import { PoolHeader } from '../components/PoolHeader'
import { EmptyMyPoolList } from '../components/EmptyMyPoolList'
import { Option } from '../components/Option'
import { Share } from 'react-native'
import { Guesses } from '../components/Guesses'

interface RouteParams {
  id: string
}

export function Details() {
  const [optionSelected, setOptionSelected] = useState<'guesses' | 'ranking'>(
    'guesses'
  )
  const [isLoading, setIsLoading] = useState(true)
  const [pollDetails, setPollDetails] = useState<PoolCardPros>(
    {} as PoolCardPros
  )

  const route = useRoute()
  const { id } = route.params as RouteParams
  const toast = useToast()

  async function fetchPoolDetails() {
    try {
      setIsLoading(true)

      const response = await api.get(`/pools/${id}`)

      setPollDetails(response.data.pool)
    } catch (error) {
      console.log(error)

      toast.show({
        title: 'Não foi possível carregar os detalhes do bolão',
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: pollDetails.code,
    })
  }

  useEffect(() => {
    fetchPoolDetails()
  }, [id])

  if (isLoading) {
    return <Loading />
  }

  return (
    <VStack flex={1} bg='gray.900'>
      <Header
        title={pollDetails.title.toUpperCase()}
        showBackButton
        showShareButton
        onShare={handleCodeShare}
      />

      {pollDetails._count.participants > 0 ? (
        <VStack flex={1} px={5}>
          <PoolHeader data={pollDetails} />

          <HStack bgColor='gray.800' p={1} rounded='sm' mb={5}>
            <Option
              title='Seus palpites'
              isSelected={optionSelected === 'guesses'}
              onPress={() => setOptionSelected('guesses')}
            />
            <Option
              title='Rank do grupo'
              isSelected={optionSelected === 'ranking'}
              onPress={() => setOptionSelected('ranking')}
            />
          </HStack>

          <Guesses poolId={pollDetails.id} code={pollDetails.code} />
        </VStack>
      ) : (
        <EmptyMyPoolList code={pollDetails.code} />
      )}
    </VStack>
  )
}
