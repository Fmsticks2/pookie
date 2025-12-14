import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { Button } from '@/components/ui/button'
import { formatAddress } from '@/lib/utils'
import { Wallet } from 'lucide-react'

export function WalletButton() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  if (isConnected && address) {
    return (
      <Button variant="outline" onClick={() => disconnect()} className="gap-2">
        <Wallet className="h-4 w-4" />
        {formatAddress(address)}
      </Button>
    )
  }

  return (
    <Button onClick={() => connect({ connector: injected() })} className="bg-primary hover:bg-primary/90">
      Connect Wallet
    </Button>
  )
}
